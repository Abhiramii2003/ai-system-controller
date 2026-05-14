require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const si = require("systeminformation");

const app = express();

app.use(cors());
app.use(express.json());


// 🔒 SAFE COMMAND EXECUTOR
const runCommand = (command, res, successMessage) => {

  exec(command, (error) => {

    if (error) {

      console.log("Exec Error:", error.message);

      return res.status(500).json({
        message: "❌ Command failed"
      });
    }

    return res.json({
      message: successMessage || "✅ Command executed"
    });
  });
};


// 🧠 SMART LOCAL INTENT DETECTOR
function detectIntent(command) {

  const cmd = command.toLowerCase();

  // 🔹 OPEN CHROME / BROWSER
  if (
    cmd.includes("chrome") ||
    cmd.includes("browser")
  ) {
    return {
      action: "open_app",
      target: "chrome"
    };
  }

  // 🔹 OPEN NOTEPAD
  if (cmd.includes("notepad")) {
    return {
      action: "open_app",
      target: "notepad"
    };
  }

  // 🔹 OPEN CALCULATOR
  if (
    cmd.includes("calculator") ||
    cmd.includes("calc")
  ) {
    return {
      action: "open_app",
      target: "calculator"
    };
  }

  // 🔹 OPEN FILE EXPLORER / PC
  if (
    cmd.includes("pc") ||
    cmd.includes("my computer") ||
    cmd.includes("file explorer") ||
    cmd.includes("explorer")
  ) {
    return {
      action: "open_app",
      target: "explorer"
    };
  }

  // 🔹 OPEN PHOTOS / GALLERY
  if (
    cmd.includes("gallery") ||
    cmd.includes("photos") ||
    cmd.includes("images")
  ) {
    return {
      action: "open_app",
      target: "photos"
    };
  }

  // 🔹 OPEN YOUTUBE
  if (cmd.includes("youtube")) {
    return {
      action: "open_website",
      target: "youtube"
    };
  }

  // 🔹 SYSTEM INFO
  if (
    cmd.includes("system") ||
    cmd.includes("cpu") ||
    cmd.includes("processor") ||
    cmd.includes("ram") ||
    cmd.includes("memory") ||
    cmd.includes("battery") ||
    cmd.includes("status") ||
    cmd.includes("laptop")
  ) {
    return {
      action: "system_info"
    };
  }

  // 🔹 SEARCH GOOGLE
  if (
    cmd.includes("search") ||
    cmd.includes("find") ||
    cmd.includes("look for")
  ) {

    return {
      action: "search",
      target: cmd
        .replace("search", "")
        .replace("find", "")
        .replace("look for", "")
        .trim()
    };
  }

  // 🔹 SHUTDOWN
  if (cmd.includes("shutdown")) {
    return {
      action: "shutdown"
    };
  }

  // 🔹 RESTART
  if (cmd.includes("restart")) {
    return {
      action: "restart"
    };
  }

  return {
    action: "unknown"
  };
}


// ⚙️ ACTION ENGINE
async function handleIntent(intent, res) {

  // 🔹 OPEN APPS
  if (intent.action === "open_app") {

    // 🌐 Chrome
    if (intent.target === "chrome") {

      return runCommand(
        "start chrome",
        res,
        "🌐 Opening Chrome..."
      );
    }

    // 📝 Notepad
    if (intent.target === "notepad") {

      return runCommand(
        "start notepad",
        res,
        "📝 Opening Notepad..."
      );
    }

    // 🧮 Calculator
    if (intent.target === "calculator") {

      return runCommand(
        "start calc",
        res,
        "🧮 Opening Calculator..."
      );
    }

    // 📁 File Explorer
    if (intent.target === "explorer") {

      return runCommand(
        "start explorer",
        res,
        "📁 Opening File Explorer..."
      );
    }

    // 🖼️ Photos
    if (intent.target === "photos") {

      return runCommand(
        "start ms-photos:",
        res,
        "🖼️ Opening Photos..."
      );
    }
  }

  // 🔹 OPEN WEBSITE
  if (intent.action === "open_website") {

    if (intent.target === "youtube") {

      return runCommand(
        "start https://www.youtube.com",
        res,
        "▶️ Opening YouTube..."
      );
    }
  }

  // 🔹 SYSTEM INFO
  if (intent.action === "system_info") {

    try {

      const cpu = await si.cpu();
      const mem = await si.mem();
      const battery = await si.battery();

      return res.json({

        cpu:
          cpu.manufacturer +
          " " +
          cpu.brand,

        cores: cpu.cores,

        totalMemory:
          (
            mem.total /
            1024 /
            1024 /
            1024
          ).toFixed(2) + " GB",

        freeMemory:
          (
            mem.free /
            1024 /
            1024 /
            1024
          ).toFixed(2) + " GB",

        battery:
          battery.hasBattery
            ? battery.percent + "%"
            : "No Battery"
      });

    } catch (error) {

      return res.status(500).json({
        message:
          "❌ Failed to fetch system information"
      });
    }
  }

  // 🔹 GOOGLE SEARCH
  if (intent.action === "search") {

    const query =
      intent.target || "google";

    return runCommand(
      `start https://www.google.com/search?q=${query}`,
      res,
      `🔍 Searching for "${query}"`
    );
  }

  // 🔹 SHUTDOWN
  if (intent.action === "shutdown") {

    return res.json({
      message:
        "⚠️ Confirm shutdown first"
    });
  }

  // 🔹 RESTART
  if (intent.action === "restart") {

    return res.json({
      message:
        "⚠️ Confirm restart first"
    });
  }

  // 🔹 UNKNOWN
  return res.json({
    message:
      "🤖 I didn't understand that yet"
  });
}


// 🧠 MAIN COMMAND ROUTE
app.post("/command", async (req, res) => {

  const { command } = req.body;

  if (!command) {

    return res.status(400).json({
      error: "No command provided"
    });
  }

  console.log("🎙️ User:", command);

  // 🔥 DETECT INTENT
  const intent = detectIntent(command);

  console.log("🧠 Intent:", intent);

  // 🔥 EXECUTE ACTION
  return handleIntent(intent, res);
});


// 🔒 CONFIRMATION ROUTE
app.post("/confirm", (req, res) => {

  const { action } = req.body;

  // 🔻 SHUTDOWN
  if (action === "shutdown") {

    exec("shutdown /s /t 5");

    return res.json({
      message:
        "💻 System shutting down in 5 seconds..."
    });
  }

  // 🔄 RESTART
  if (action === "restart") {

    exec("shutdown /r /t 5");

    return res.json({
      message:
        "🔄 System restarting in 5 seconds..."
    });
  }

  return res.json({
    message:
      "❌ Invalid action"
  });
});


// 📊 SYSTEM INFO ROUTE
app.get("/system-info", async (req, res) => {

  try {

    const cpu = await si.cpu();
    const mem = await si.mem();
    const battery = await si.battery();

    return res.json({

      cpu:
        cpu.manufacturer +
        " " +
        cpu.brand,

      cores: cpu.cores,

      totalMemory:
        (
          mem.total /
          1024 /
          1024 /
          1024
        ).toFixed(2) + " GB",

      freeMemory:
        (
          mem.free /
          1024 /
          1024 /
          1024
        ).toFixed(2) + " GB",

      battery:
        battery.hasBattery
          ? battery.percent + "%"
          : "No Battery"
    });

  } catch (error) {

    return res.status(500).json({
      error:
        "❌ Failed to fetch system info"
    });
  }
});


// ✅ ROOT ROUTE
app.get("/", (req, res) => {

  res.send("🚀 AI Agent Running...");
});


// 🚀 START SERVER
app.listen(5000, () => {

  console.log(
    "🚀 Server running on port 5000"
  );
});