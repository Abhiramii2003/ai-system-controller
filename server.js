require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const si = require("systeminformation");
const fs = require("fs");
const path = require("path");
const screenshot = require("screenshot-desktop");
const loudness = require("loudness");

const app = express();

app.use(cors());
app.use(express.json());


// ======================================================
// 📂 FILE PATHS
// ======================================================

const memoryPath = path.join(
  __dirname,
  "memory.json"
);

const historyPath = path.join(
  __dirname,
  "history.json"
);


// ======================================================
// 🧠 CREATE FILES IF NOT EXISTS
// ======================================================

if (!fs.existsSync(memoryPath)) {

  fs.writeFileSync(
    memoryPath,
    JSON.stringify(
      {
        favoriteApps: {}
      },
      null,
      2
    )
  );
}

if (!fs.existsSync(historyPath)) {

  fs.writeFileSync(
    historyPath,
    JSON.stringify([], null, 2)
  );
}


// ======================================================
// 🔒 SAFE COMMAND EXECUTOR
// ======================================================

const runCommand = (
  command,
  res,
  successMessage
) => {

  exec(command, (error) => {

    if (error) {

      console.log(
        "❌ Exec Error:",
        error.message
      );

      return res.status(500).json({
        message: "❌ Command failed"
      });
    }

    return res.json({
      message:
        successMessage ||
        "✅ Command executed"
    });
  });
};


// ======================================================
// 📜 SAVE COMMAND HISTORY
// ======================================================

const saveHistory = (command) => {

  const history =
    JSON.parse(
      fs.readFileSync(historyPath)
    );

  history.push({
    command,
    time:
      new Date().toLocaleString()
  });

  fs.writeFileSync(
    historyPath,
    JSON.stringify(history, null, 2)
  );
};


// ======================================================
// ⭐ UPDATE MEMORY
// ======================================================

const updateMemory = (appName) => {

  const memory =
    JSON.parse(
      fs.readFileSync(memoryPath)
    );

  if (
    !memory.favoriteApps[appName]
  ) {

    memory.favoriteApps[appName] = 0;
  }

  memory.favoriteApps[appName]++;

  fs.writeFileSync(
    memoryPath,
    JSON.stringify(memory, null, 2)
  );
};


// ======================================================
// 🧠 SMART LOCAL INTENT DETECTOR
// ======================================================

function detectIntent(command) {

  const cmd =
    command.toLowerCase();

  // 🌐 CHROME
  if (
    cmd.includes("chrome") ||
    cmd.includes("browser")
  ) {

    return {
      action: "open_app",
      target: "chrome"
    };
  }

  // 📝 NOTEPAD
  if (
    cmd.includes("notepad")
  ) {

    return {
      action: "open_app",
      target: "notepad"
    };
  }

  // 🧮 CALCULATOR
  if (
    cmd.includes("calculator") ||
    cmd.includes("calc")
  ) {

    return {
      action: "open_app",
      target: "calculator"
    };
  }

  // 📁 EXPLORER
  if (
    cmd.includes("explorer") ||
    cmd.includes("file explorer") ||
    cmd.includes("my computer") ||
    cmd.includes("pc")
  ) {

    return {
      action: "open_app",
      target: "explorer"
    };
  }

  // 🖼️ PHOTOS
  if (
    cmd.includes("photos") ||
    cmd.includes("gallery") ||
    cmd.includes("images")
  ) {

    return {
      action: "open_app",
      target: "photos"
    };
  }

  // ▶️ YOUTUBE
  if (
    cmd.includes("youtube")
  ) {

    return {
      action: "open_website",
      target: "youtube"
    };
  }

  // 💻 CODING MODE
  if (
    cmd.includes("coding mode") ||
    cmd.includes("start coding")
  ) {

    return {
      action: "coding_mode"
    };
  }

  // 📚 STUDY MODE
  if (
    cmd.includes("study mode")
  ) {

    return {
      action: "study_mode"
    };
  }

  // 🎵 ENTERTAINMENT MODE
  if (
    cmd.includes("entertainment mode") ||
    cmd.includes("fun mode")
  ) {

    return {
      action: "entertainment_mode"
    };
  }

  // 🧑‍💻 INTERVIEW MODE
  if (
    cmd.includes("interview mode") ||
    cmd.includes("job preparation")
  ) {

    return {
      action: "interview_mode"
    };
  }

  // 🌙 NIGHT MODE
  if (
    cmd.includes("night mode")
  ) {

    return {
      action: "night_mode"
    };
  }

  // 📸 SCREENSHOT
  if (
    cmd.includes("take screenshot") ||
    cmd.includes("capture screenshot") ||
    cmd.includes("screenshot capture")
  ) {

    return {
      action: "screenshot"
    };
  }

  // 📂 DOWNLOADS
  if (
    cmd.includes("open downloads")
  ) {

    return {
      action: "open_folder",
      target: "downloads"
    };
  }

  // 🔊 VOLUME UP
  if (
    cmd.includes("volume up")
  ) {

    return {
      action: "volume_up"
    };
  }

  // 🔉 VOLUME DOWN
  if (
    cmd.includes("volume down")
  ) {

    return {
      action: "volume_down"
    };
  }

  // 🔇 MUTE
  if (
    cmd.includes("mute")
  ) {

    return {
      action: "mute_volume"
    };
  }

  // ⏰ SCHEDULED AUTOMATION
  if (
    cmd.includes("scheduled automation")
  ) {

    return {
      action: "scheduled_automation"
    };
  }

  // 🔋 BATTERY
  if (
    cmd.includes("battery percentage") ||
    cmd.includes("battery")
  ) {

    return {
      action: "battery_info"
    };
  }

  // 📊 SYSTEM INFO
  if (
    cmd.includes("system") ||
    cmd.includes("cpu") ||
    cmd.includes("processor") ||
    cmd.includes("ram") ||
    cmd.includes("memory") ||
    cmd.includes("status") ||
    cmd.includes("laptop")
  ) {

    return {
      action: "system_info"
    };
  }

  // 🔍 SEARCH
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

  // 💻 SHUTDOWN
  if (
    cmd.includes("shutdown")
  ) {

    return {
      action: "shutdown"
    };
  }

  // 🔄 RESTART
  if (
    cmd.includes("restart")
  ) {

    return {
      action: "restart"
    };
  }

  return {
    action: "unknown"
  };
}


// ======================================================
// ⚙️ ACTION ENGINE
// ======================================================

async function handleIntent(
  intent,
  res
) {

  // ==================================================
  // 🔹 OPEN APPS
  // ==================================================

  if (
    intent.action ===
    "open_app"
  ) {

    if (
      intent.target ===
      "chrome"
    ) {

      updateMemory("chrome");

      return runCommand(
        "start chrome",
        res,
        "🌐 Opening Chrome..."
      );
    }

    if (
      intent.target ===
      "notepad"
    ) {

      updateMemory("notepad");

      return runCommand(
        "start notepad",
        res,
        "📝 Opening Notepad..."
      );
    }

    if (
      intent.target ===
      "calculator"
    ) {

      updateMemory(
        "calculator"
      );

      return runCommand(
        "start calc",
        res,
        "🧮 Opening Calculator..."
      );
    }

    if (
      intent.target ===
      "explorer"
    ) {

      updateMemory(
        "explorer"
      );

      return runCommand(
        "start explorer",
        res,
        "📁 Opening Explorer..."
      );
    }

    if (
      intent.target ===
      "photos"
    ) {

      updateMemory("photos");

      return runCommand(
        "start ms-photos:",
        res,
        "🖼️ Opening Photos..."
      );
    }
  }


  // ==================================================
  // ▶️ OPEN WEBSITE
  // ==================================================

  if (
    intent.action ===
    "open_website"
  ) {

    if (
      intent.target ===
      "youtube"
    ) {

      return runCommand(
        "start https://www.youtube.com",
        res,
        "▶️ Opening YouTube..."
      );
    }
  }


  // ==================================================
  // 💻 CODING MODE
  // ==================================================

  if (
    intent.action ===
    "coding_mode"
  ) {

    updateMemory(
      "coding_mode"
    );

    exec("start code");
    exec("start chrome");
    exec("start cmd");
    exec("start https://github.com");

    return res.json({
      message:
        "🚀 Coding Mode Activated"
    });
  }


  // ==================================================
  // 📚 STUDY MODE
  // ==================================================

  if (
    intent.action ===
    "study_mode"
  ) {

    updateMemory(
      "study_mode"
    );

    exec("start chrome");
    exec("start https://www.youtube.com");
    exec("start https://chat.openai.com");

    return res.json({
      message:
        "📚 Study Mode Activated"
    });
  }


  // ==================================================
  // 🎵 ENTERTAINMENT MODE
  // ==================================================

  if (
    intent.action ===
    "entertainment_mode"
  ) {

    exec("start chrome");
    exec("start https://www.youtube.com");
    exec("start https://open.spotify.com");

    return res.json({
      message:
        "🎵 Entertainment Mode Activated"
    });
  }


  // ==================================================
  // 🧑‍💻 INTERVIEW MODE
  // ==================================================

  if (
    intent.action ===
    "interview_mode"
  ) {

    exec("start chrome");
    exec("start https://leetcode.com");
    exec("start https://github.com");
    exec("start code");

    return res.json({
      message:
        "🧑‍💻 Interview Mode Activated"
    });
  }


  // ==================================================
  // 🌙 NIGHT MODE
  // ==================================================

  if (
    intent.action ===
    "night_mode"
  ) {

    exec("start ms-settings:nightlight");

    return res.json({
      message:
        "🌙 Night Mode Opened"
    });
  }


  // ==================================================
  // 📸 SCREENSHOT
  // ==================================================

  if (
    intent.action ===
    "screenshot"
  ) {

    const filePath =
      path.join(
        __dirname,
        `screenshot-${Date.now()}.jpg`
      );

    await screenshot({
      filename: filePath
    });

    return res.json({
      message:
        "📸 Screenshot Captured",
      path: filePath
    });
  }


  // ==================================================
  // 📂 OPEN FOLDER
  // ==================================================

  if (
    intent.action ===
    "open_folder"
  ) {

    if (
      intent.target ===
      "downloads"
    ) {

      return runCommand(
        "start shell:Downloads",
        res,
        "📂 Opening Downloads Folder..."
      );
    }
  }


  // ==================================================
  // 🔊 VOLUME UP
  // ==================================================

  if (
    intent.action ===
    "volume_up"
  ) {

    let current =
      await loudness.getVolume();

    current =
      Math.min(current + 10, 100);

    await loudness.setVolume(current);

    return res.json({
      message:
        `🔊 Volume Increased to ${current}%`
    });
  }


  // ==================================================
  // 🔉 VOLUME DOWN
  // ==================================================

  if (
    intent.action ===
    "volume_down"
  ) {

    let current =
      await loudness.getVolume();

    current =
      Math.max(current - 10, 0);

    await loudness.setVolume(current);

    return res.json({
      message:
        `🔉 Volume Reduced to ${current}%`
    });
  }


  // ==================================================
  // 🔇 MUTE
  // ==================================================

  if (
    intent.action ===
    "mute_volume"
  ) {

    await loudness.setMuted(true);

    return res.json({
      message:
        "🔇 System Muted"
    });
  }


  // ==================================================
  // ⏰ SCHEDULED AUTOMATION
  // ==================================================

  if (
    intent.action ===
    "scheduled_automation"
  ) {

    setTimeout(() => {

      exec("start notepad");

    }, 10000);

    return res.json({
      message:
        "⏰ Automation scheduled. Opening Notepad in 10 seconds..."
    });
  }


  // ==================================================
  // 🔋 BATTERY INFO
  // ==================================================

  if (
    intent.action ===
    "battery_info"
  ) {

    const battery =
      await si.battery();

    return res.json({
      message:
        `🔋 Battery: ${battery.percent}%`
    });
  }


  // ==================================================
  // 📊 SYSTEM INFO
  // ==================================================

  if (
    intent.action ===
    "system_info"
  ) {

    try {

      const cpu =
        await si.cpu();

      const mem =
        await si.mem();

      const battery =
        await si.battery();

      return res.json({

        cpu:
          cpu.manufacturer +
          " " +
          cpu.brand,

        cores:
          cpu.cores,

        totalMemory:
          (
            mem.total /
            1024 /
            1024 /
            1024
          ).toFixed(2) +
          " GB",

        freeMemory:
          (
            mem.free /
            1024 /
            1024 /
            1024
          ).toFixed(2) +
          " GB",

        battery:
          battery.hasBattery
            ? battery.percent + "%"
            : "No Battery"
      });

    } catch (error) {

      return res.status(500).json({
        message:
          "❌ Failed to fetch system info"
      });
    }
  }


  // ==================================================
  // 🔍 GOOGLE SEARCH
  // ==================================================

  if (
    intent.action ===
    "search"
  ) {

    const query =
      intent.target ||
      "google";

    return runCommand(
      `start https://www.google.com/search?q=${query}`,
      res,
      `🔍 Searching "${query}"`
    );
  }


  // ==================================================
  // 💻 SHUTDOWN
  // ==================================================

  if (
    intent.action ===
    "shutdown"
  ) {

    return res.json({
      message:
        "⚠️ Confirm shutdown first"
    });
  }


  // ==================================================
  // 🔄 RESTART
  // ==================================================

  if (
    intent.action ===
    "restart"
  ) {

    return res.json({
      message:
        "⚠️ Confirm restart first"
    });
  }


  // ==================================================
  // ❓ UNKNOWN
  // ==================================================

  return res.json({
    message:
      "🤖 I didn't understand that yet"
  });
}


// ======================================================
// 🧠 MAIN COMMAND ROUTE
// ======================================================

app.post(
  "/command",
  async (req, res) => {

    const { command } =
      req.body;

    if (!command) {

      return res.status(400).json({
        error:
          "No command provided"
      });
    }

    console.log(
      "🎙️ User:",
      command
    );

    saveHistory(command);

    const intent =
      detectIntent(command);

    console.log(
      "🧠 Intent:",
      intent
    );

    return handleIntent(
      intent,
      res
    );
  }
);


// ======================================================
// 📜 HISTORY API
// ======================================================

app.get(
  "/history",
  (req, res) => {

    const history =
      JSON.parse(
        fs.readFileSync(
          historyPath
        )
      );

    res.json(history);
  }
);


// ======================================================
// ⭐ MEMORY API
// ======================================================

app.get(
  "/memory",
  (req, res) => {

    const memory =
      JSON.parse(
        fs.readFileSync(
          memoryPath
        )
      );

    res.json(memory);
  }
);


// ======================================================
// ✅ ROOT
// ======================================================

app.get("/", (req, res) => {

  res.send(
    "🚀 AI Smart Automation Agent Running..."
  );
});


// ======================================================
// 🚀 START SERVER
// ======================================================

app.listen(5000, () => {

  console.log(
    "🚀 Server running on port 5000"
  );
});