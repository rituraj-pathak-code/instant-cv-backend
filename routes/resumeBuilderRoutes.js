import { Router } from "express";
import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";
import fs from "fs";
import Resume from "../models/ResumeBuilderModal.js";

const router = Router();
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/resume/create", async (req, res) => {
  const { personalInfo, education, experience, projects, skills } = req.body;
  try {
    const html = await ejs.renderFile(
      path.join(__dirname, "..", "templates", "resumeTemplate.ejs"),
      {
        personalInfo,
        education,
        experience,
        projects,
        skills,
      }
    );
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });
    const imageBase64  = await page.screenshot({
      encoding: 'base64',
      type: 'jpeg', 
      fullPage: true 
    });
    await browser.close();

    const imageDataUri = `data:image/jpeg;base64,${imageBase64}`;

    const newResume = await Resume.insertMany({
      user: req.session.user._id,
      personalInfo,
      education,
      experience,
      projects,
      skills,
      image: imageDataUri
    });
    if (!newResume) {
      return res
        .status(500)
        .send({ message: "Something went Wrong.Try Again Later!" });
    }

    const filePath = `./templates/${personalInfo.firstName}_${personalInfo.lastName}_Resume.pdf`;
    fs.writeFileSync(filePath, pdfBuffer);

    res.download(filePath, (err) => {
      if (err) {
        console.error(err);
      } else {
        fs.unlink(
          `./templates/${personalInfo.firstName}_${personalInfo.lastName}_Resume.pdf`,
          (err) => {
            if (err) {
              console.error("Error deleting PDF file:", err);
            } else {
              console.log(
                "PDF file deleted"
              );
            }
          }
        );
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error generating PDF" });
  }
});

router.get("/resumes/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const resumes = await Resume.find({ user: userId });

    if (resumes.length === 0) {
      return res
        .status(404)
        .json({ message: "No resumes found for this user" });
    }

    const formattedResumes = resumes.map(resume => {
      return {
        ...resume.toObject(), 
        image: resume.image ? resume.image.toString('base64') : null 
      };
    });

    res.status(200).json(formattedResumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete('/resume/:id', async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: "Resume id is required" });
  }

  try {
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    await Resume.deleteOne({ _id: id });

    return res.status(200).json({ message: "Resume deleted successfully" });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
