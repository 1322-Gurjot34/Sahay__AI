import { useEffect, useRef, useState } from "react";
import "./App.css";
import { languages } from "./i18n";

import {
  Accessibility,
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Eye,
  EyeOff,
  FileText,
  History,
  Home,
  Languages,
  Lightbulb,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Navigation,
  Pause,
  Play,
  RotateCcw,
  Scan,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Volume2,
  VolumeX,
  Waypoints,
  X,
} from "lucide-react";

import { analyzeScenario } from "./sahayEngine";





/* =========================================================
   PROFILE CONFIG
========================================================= */

const profiles = [
  {
    id: "Vision",
    icon: Eye,
    title: "Vision",
    description: "Audio-first environmental guidance",
  },
  {
    id: "Mobility",
    icon: Accessibility,
    title: "Mobility",
    description: "Accessible routes and movement support",
  },
  {
    id: "Hearing",
    icon: VolumeX,
    title: "Hearing",
    description: "Visual alerts and environmental awareness",
  },
  {
    id: "Cognitive",
    icon: Lightbulb,
    title: "Cognitive",
    description: "Simple step-by-step guidance",
  },
];


/* =========================================================
   SCENARIOS
========================================================= */

const scenarios = [
  {
    id: "stairs",
    label: "Stairs",
    description: "Staircase environment",
  },
  {
    id: "ramp",
    label: "Accessible Ramp",
    description: "Accessible route",
  },
  {
    id: "blocked",
    label: "Blocked Corridor",
    description: "Obstacle on route",
  },
  {
    id: "entrance",
    label: "Complex Entrance",
    description: "Multiple access points",
  },
  {
    id: "clear",
    label: "Clear Pathway",
    description: "Open accessible path",
  },
];


/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  /* -------------------------------------------------------
     LOGIN
  ------------------------------------------------------- */

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("sahay-logged-in") === "true"
  );

  const [userName, setUserName] = useState(
    localStorage.getItem("sahay-user") || ""
  );


  /* -------------------------------------------------------
     LANGUAGE
  ------------------------------------------------------- */

  const [language, setLanguage] = useState(
    localStorage.getItem("sahay-language") || "en"
  );

  const t = languages[language]?.text || languages.en.text;

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("sahay-language", lang);
  };


  /* -------------------------------------------------------
     THEME
  ------------------------------------------------------- */

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("sahay-theme") === "dark"
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);

    localStorage.setItem(
      "sahay-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);


  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */

  const [page, setPage] = useState("home");

  const [sidebarOpen, setSidebarOpen] = useState(false);


  /* -------------------------------------------------------
     ACCESSIBILITY PROFILE
  ------------------------------------------------------- */

  const [profile, setProfile] = useState(
    localStorage.getItem("sahay-profile") || "Vision"
  );

  const changeProfile = (value) => {
    setProfile(value);
    localStorage.setItem("sahay-profile", value);
  };


  /* -------------------------------------------------------
     SCENARIO
  ------------------------------------------------------- */

  const [scenario, setScenario] = useState("stairs");


  /* -------------------------------------------------------
     ANALYSIS
  ------------------------------------------------------- */

  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sahay-history") || "[]");
    } catch {
      return [];
    }
  });


  /* -------------------------------------------------------
     IMAGE
  ------------------------------------------------------- */

  const [imagePreview, setImagePreview] = useState(null);


  /* -------------------------------------------------------
     VOICE
  ------------------------------------------------------- */

  const [voiceEnabled, setVoiceEnabled] = useState(true);


  /* -------------------------------------------------------
     LOGIN
  ------------------------------------------------------- */

  const handleLogin = (name, selectedProfile) => {
    const finalName = name.trim() || "Guest";
    const finalProfile = selectedProfile || profile;

    localStorage.setItem("sahay-logged-in", "true");
    localStorage.setItem("sahay-user", finalName);
    localStorage.setItem("sahay-profile", finalProfile);

    setUserName(finalName);
    setProfile(finalProfile);
    setLoggedIn(true);
  };


  const handleLogout = () => {
    localStorage.removeItem("sahay-logged-in");
    localStorage.removeItem("sahay-user");

    setLoggedIn(false);
    setUserName("");
  };


  /* -------------------------------------------------------
     SPEECH
  ------------------------------------------------------- */

  const speak = (message) => {
    if (!voiceEnabled) return;

    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);

    utterance.lang =
      languages[language]?.voice ||
      "en-IN";

    utterance.rate = 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };


  /* -------------------------------------------------------
     ANALYZE
  ------------------------------------------------------- */

  const runAnalysis = () => {
    setLoading(true);

    setTimeout(() => {
      try {
        const result = analyzeScenario(
          profile,
          scenario
        );

        setAnalysis(result);

        const historyItem = {
          title: result?.environment || "Environment analysis",
          detail: result?.recommended_action || "Accessibility recommendation generated",
          time: new Date().toLocaleString(),
        };
        setHistory((current) => {
          const next = [historyItem, ...current].slice(0, 10);
          localStorage.setItem("sahay-history", JSON.stringify(next));
          return next;
        });

        if (result?.short_instruction) {
          speak(result.short_instruction);
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }, 900);
  };


  /* -------------------------------------------------------
     IMAGE UPLOAD
  ------------------------------------------------------- */

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };


  /* -------------------------------------------------------
     NAVIGATION HELPER
  ------------------------------------------------------- */

  const navigateTo = (target) => {
    setPage(target);
    setSidebarOpen(false);
  };


  /* -------------------------------------------------------
     LOGIN SCREEN
  ------------------------------------------------------- */

  if (!loggedIn) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        profile={profile}
        language={language}
        changeLanguage={changeLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }


  /* -------------------------------------------------------
     MAIN APP
  ------------------------------------------------------- */

  return (
    <div className="sahay-app">

      {/* SIDEBAR */}

      <aside
        className={`sahay-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >

        <div className="sidebar-brand">

          <div className="brand-symbol">
            <Sparkles size={20} />
          </div>

          <div>
            <div className="brand-name">
              SAHAY
            </div>

            <div className="brand-subtitle">
              Accessibility Intelligence
            </div>
          </div>

        </div>


        <nav className="sidebar-nav">

          <SidebarItem
            icon={Home}
            label={t.dashboard || "Dashboard"}
            active={page === "home"}
            onClick={() => navigateTo("home")}
          />

          <SidebarItem
            icon={Camera}
            label={t.liveAssist || "Live Assist"}
            active={page === "live"}
            onClick={() => navigateTo("live")}
          />

          <SidebarItem
            icon={FileText}
            label={t.reader || "Read"}
            active={page === "reader"}
            onClick={() => navigateTo("reader")}
          />

          <SidebarItem
            icon={Navigation}
            label={t.navigate || "Navigate"}
            active={page === "navigate"}
            onClick={() => navigateTo("navigate")}
          />

          <SidebarItem
            icon={History}
            label={t.history || "History"}
            active={page === "history"}
            onClick={() => navigateTo("history")}
          />

        </nav>


        <div className="sidebar-bottom">

          <SidebarItem
            icon={Settings}
            label={t.settings || "Settings"}
            active={page === "settings"}
            onClick={() => navigateTo("settings")}
          />


          <button
            className="sidebar-user"
            onClick={() => navigateTo("settings")}
          >

            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="user-info">

              <strong>
                {userName}
              </strong>

              <span>
                {profile}
              </span>

            </div>

          </button>

        </div>

      </aside>


      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* MAIN */}

      <main className="sahay-main">

        {/* TOP BAR */}

        <header className="topbar">

          <button
            className="mobile-menu"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
            aria-label="Open menu"
          >
            {sidebarOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>


          <div className="topbar-title">

            <span>
              {page === "home" && "Dashboard"}

              {page === "live" &&
                (t.liveAssist || "Live Assist")}

              {page === "reader" &&
                (t.reader || "Read")}

              {page === "navigate" &&
                (t.navigate || "Navigate")}

              {page === "history" &&
                (t.history || "History")}

              {page === "settings" &&
                (t.settings || "Settings")}
            </span>

          </div>


          <div className="topbar-actions">

            {/* LANGUAGE */}

            <div className="language-selector">

              <Languages size={17} />

              <select
                value={language}
                onChange={(e) =>
                  changeLanguage(e.target.value)
                }
              >

                {Object.entries(languages).map(
                  ([code, lang]) => (
                    <option
                      key={code}
                      value={code}
                    >
                      {lang.name}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* VOICE */}

            <button
              className="icon-button"
              onClick={() =>
                setVoiceEnabled(!voiceEnabled)
              }
              title="Voice guidance"
            >

              {voiceEnabled ? (
                <Volume2 size={19} />
              ) : (
                <VolumeX size={19} />
              )}

            </button>


            {/* THEME */}

            <button
              className="icon-button"
              onClick={() =>
                setDarkMode(!darkMode)
              }
              title="Toggle theme"
            >

              {darkMode ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}

            </button>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <div className="page-container">

          {page === "home" && (
            <HomePage
              t={t}
              userName={userName}
              profile={profile}
              setProfile={changeProfile}
              navigateTo={navigateTo}
              analysis={analysis}
              scenario={scenario}
              setScenario={setScenario}
              runAnalysis={runAnalysis}
              loading={loading}
              imagePreview={imagePreview}
              handleImageUpload={handleImageUpload}
              speak={speak}
            />
          )}


          {page === "live" && (
            <LiveAssist
              t={t}
              profile={profile}
              scenario={scenario}
              setScenario={setScenario}
              analysis={analysis}
              setAnalysis={setAnalysis}
              speak={speak}
              voiceEnabled={voiceEnabled}
            />
          )}


          {page === "reader" && (
            <ReaderPage
              t={t}
              speak={speak}
            />
          )}


          {page === "navigate" && (
            <NavigatePage
              t={t}
              profile={profile}
              speak={speak}
            />
          )}


          {page === "history" && (
            <HistoryPage
              t={t}
              history={history}
            />
          )}


          {page === "settings" && (
            <SettingsPage
              t={t}
              language={language}
              changeLanguage={changeLanguage}
              profile={profile}
              setProfile={changeProfile}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              voiceEnabled={voiceEnabled}
              setVoiceEnabled={setVoiceEnabled}
              handleLogout={handleLogout}
            />
          )}

        </div>


        {/* MOBILE NAV */}

        <nav className="mobile-bottom-nav">

          <MobileNavItem
            icon={Home}
            label="Home"
            active={page === "home"}
            onClick={() => navigateTo("home")}
          />

          <MobileNavItem
            icon={Camera}
            label="Assist"
            active={page === "live"}
            onClick={() => navigateTo("live")}
          />

          <MobileNavItem
            icon={Navigation}
            label="Navigate"
            active={page === "navigate"}
            onClick={() => navigateTo("navigate")}
          />

          <MobileNavItem
            icon={Settings}
            label="Settings"
            active={page === "settings"}
            onClick={() => navigateTo("settings")}
          />

        </nav>

      </main>

    </div>
  );
}


/* =========================================================
   LOGIN SCREEN
========================================================= */

function LoginScreen({
  onLogin,
  profile,
  language,
  changeLanguage,
  darkMode,
  setDarkMode,
}) {

  const [name, setName] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(profile || "Vision");

  const t =
    languages[language]?.text ||
    languages.en.text;


  const submit = (event) => {
    event.preventDefault();

    onLogin(name, selectedProfile);
  };


  return (
    <div className="login-screen">

      <div className="login-background-glow" />

      <div className="login-card">

        <div className="login-brand">

          <div className="brand-symbol large">
            <Sparkles size={28} />
          </div>

          <div>

            <h1>
              SAHAY
            </h1>

            <p>
              Accessibility Intelligence
            </p>

          </div>

        </div>


        <div className="login-content">

          <span className="eyebrow">
            SMART ACCESSIBILITY
          </span>

          <h2>
            {t.welcome ||
              "Welcome to SAHAY"}
          </h2>

          <p>
            {t.tagline ||
              "Your world. Your needs. Your way."}
          </p>


          <form onSubmit={submit}>

            <label htmlFor="sahay-name">Your name</label>

            <input
              id="sahay-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoComplete="name"
              required
            />

            <div className="onboarding-label">
              Choose your accessibility profile
            </div>

            <div className="onboarding-profiles">
              {profiles.map((item) => {
                const Icon = item.icon;
                const active = selectedProfile === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`onboarding-profile ${active ? "active" : ""}`}
                    onClick={() => setSelectedProfile(item.id)}
                    aria-pressed={active}
                  >
                    <Icon size={19} />
                    <span>{t[item.id.toLowerCase()] || item.title}</span>
                    {active && <CheckCircle2 size={16} />}
                  </button>
                );
              })}
            </div>

            <button
              className="primary-btn full-width"
              type="submit"
            >

              <LogIn size={18} />

              Continue

              <ArrowRight size={18} />

            </button>

          </form>


          <div className="login-options">

            <div className="language-selector">

              <Languages size={17} />

              <select
                value={language}
                onChange={(e) =>
                  changeLanguage(e.target.value)
                }
              >

                {Object.entries(languages).map(
                  ([code, lang]) => (
                    <option
                      key={code}
                      value={code}
                    >
                      {lang.name}
                    </option>
                  )
                )}

              </select>

            </div>


            <button
              className="icon-button"
              onClick={() =>
                setDarkMode(!darkMode)
              }
            >

              {darkMode ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}

            </button>

          </div>

        </div>


        <div className="login-footer">

          <ShieldCheck size={16} />

          <span>
            Designed around accessibility
          </span>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   HOME PAGE
========================================================= */

function HomePage({
  t,
  userName,
  profile,
  setProfile,
  navigateTo,
  analysis,
  scenario,
  setScenario,
  runAnalysis,
  loading,
  imagePreview,
  handleImageUpload,
  speak,
}) {

  return (
    <div className="dashboard-page">

      {/* HERO */}

      <section className="hero-section">

        <div className="hero-copy">

          <span className="eyebrow">
            ACCESSIBILITY INTELLIGENCE
          </span>

          <h1>
            {t.welcome ||
              `Good to see you, ${userName}.`}
          </h1>

          <p>
            {t.tagline ||
              "Understand your environment. Find the safest way forward."}
          </p>


          <div className="hero-actions">

            <button
              className="primary-btn"
              onClick={() => navigateTo("live")}
            >

              <Camera size={18} />

              {t.startAssist ||
                "Start Live Assist"}

            </button>


            <button
              className="secondary-btn"
              onClick={() => navigateTo("navigate")}
            >

              <Navigation size={18} />

              {t.navigate || "Navigate"}

            </button>

          </div>

        </div>


        <div className="hero-visual">

          <div className="hero-orbit">

            <div className="orbit-ring ring-one" />
            <div className="orbit-ring ring-two" />

            <div className="hero-center-icon">
              <Accessibility size={42} />
            </div>

          </div>

        </div>

      </section>


      {/* PROFILE */}

      <section className="section-block">

        <div className="section-heading">

          <div>

            <span className="section-kicker">
              PERSONALIZATION
            </span>

            <h2>
              {t.accessibilityProfile ||
                "Accessibility Profile"}
            </h2>

          </div>

          <span className="profile-status">
            Active
          </span>

        </div>


        <div className="profile-grid">

          {profiles.map((item) => {

            const Icon = item.icon;

            const active =
              profile === item.id;

            return (
              <button
                key={item.id}
                className={`profile-card ${
                  active ? "active" : ""
                }`}
                onClick={() =>
                  setProfile(item.id)
                }
                aria-pressed={active}
              >

                <div className="profile-icon">
                  <Icon size={22} />
                </div>

                <div className="profile-content">

                  <strong>
                    {t[item.id.toLowerCase()] ||
                      item.title}
                  </strong>

                  <span>
                    {item.description}
                  </span>

                </div>

                {active && (
                  <CheckCircle2
                    className="profile-check"
                    size={20}
                  />
                )}

              </button>
            );

          })}

        </div>

      </section>


      {/* DEMO SCAN */}

      <section className="section-block">

        <div className="section-heading">

          <div>

            <span className="section-kicker">
              ENVIRONMENT ANALYSIS
            </span>

            <h2>
              {t.scanEnvironment ||
                "Scan Environment"}
            </h2>

          </div>

        </div>


        <div className="analysis-layout">

          {/* CAMERA / UPLOAD */}

          <div className="scan-card">

            <div className="scan-card-header">

              <div>
                <h3>
                  Visual input
                </h3>

                <p>
                  Upload an environment image
                  or choose a demo scenario.
                </p>
              </div>

              <Scan size={22} />

            </div>


            <div className="image-preview">

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Uploaded environment"
                />
              ) : (
                <div className="empty-preview">

                  <Camera size={34} />

                  <strong>
                    Environment preview
                  </strong>

                  <span>
                    Camera or image input
                  </span>

                </div>
              )}

            </div>


            <label className="upload-btn">

              <Camera size={17} />

              Upload image

              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                hidden
              />

            </label>

          </div>


          {/* REASONING */}

          <div className="reasoning-card">

            <div className="scan-card-header">

              <div>

                <h3>
                  Demo environment
                </h3>

                <p>
                  Test SAHAY's accessibility
                  reasoning layer.
                </p>

              </div>

              <Sparkles size={22} />

            </div>


            <div className="scenario-list">

              {scenarios.map((item) => (

                <button
                  key={item.id}
                  className={`scenario-item ${
                    scenario === item.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setScenario(item.id)
                  }
                >

                  <div>

                    <strong>
                      {item.label}
                    </strong>

                    <span>
                      {item.description}
                    </span>

                  </div>

                  <ChevronRight size={18} />

                </button>

              ))}

            </div>


            <button
              className="primary-btn full-width"
              onClick={runAnalysis}
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="loading-spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  {t.analyze ||
                    "Analyze Environment"}
                </>
              )}

            </button>

          </div>

        </div>

      </section>


      {/* RESULT */}

      {analysis && (
        <AnalysisResult
          analysis={analysis}
          t={t}
          speak={speak}
        />
      )}

    </div>
  );
}


/* =========================================================
   ANALYSIS RESULT
========================================================= */

function AnalysisResult({
  analysis,
  t,
  speak,
}) {

  return (
    <section className="result-section">

      <div className="result-header">

        <div>

          <span className="section-kicker">
            SAHAY ANALYSIS
          </span>

          <h2>
            {analysis.environment}
          </h2>

        </div>


        <div className="score-card">

          <span>
            Accessibility
          </span>

          <strong>
            {analysis.accessibility_score}
          </strong>

          <small>
            / 100
          </small>

        </div>

      </div>


      <div className="result-grid">

        <ResultBox
          title={t.detected || "Detected"}
          items={analysis.objects}
        />

        <ResultBox
          title={
            t.barriers ||
            "Barriers"
          }
          items={analysis.barriers}
          danger
        />

        <ResultBox
          title={
            t.accessibleFeatures ||
            "Accessible Features"
          }
          items={
            analysis.accessible_features
          }
        />

        <ResultBox
          title={
            t.hazards ||
            "Hazards"
          }
          items={analysis.hazards}
          danger
        />

      </div>


      <div className="recommendation-card">

        <div className="recommendation-icon">
          <Lightbulb size={24} />
        </div>

        <div className="recommendation-content">

          <span>
            {t.recommendation ||
              "Recommendation"}
          </span>

          <h3>
            {analysis.recommended_action}
          </h3>

          <p>
            {analysis.reasoning}
          </p>

        </div>


        <button
          className="voice-action"
          onClick={() =>
            speak(
              analysis.short_instruction ||
                analysis.recommended_action
            )
          }
        >

          <Volume2 size={18} />

          Listen

        </button>

      </div>


      <div className="instruction-strip">

        <Navigation size={20} />

        <strong>
          {analysis.short_instruction}
        </strong>

      </div>

    </section>
  );
}


/* =========================================================
   RESULT BOX
========================================================= */

function ResultBox({
  title,
  items = [],
  danger = false,
}) {

  return (
    <div
      className={`result-box ${
        danger ? "danger" : ""
      }`}
    >

      <h4>
        {title}
      </h4>

      {items.length > 0 ? (

        <ul>

          {items.map(
            (item, index) => (
              <li key={index}>
                {item}
              </li>
            )
          )}

        </ul>

      ) : (

        <span className="empty-result">
          None detected
        </span>

      )}

    </div>
  );
}


/* =========================================================
   LIVE ASSIST
========================================================= */

function LiveAssist({
  t,
  profile,
  scenario,
  setScenario,
  analysis,
  setAnalysis,
  speak,
  voiceEnabled,
}) {

  const videoRef = useRef(null);

  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] =
    useState(false);

  const [assistRunning, setAssistRunning] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");


  useEffect(() => {

    return () => {
      stopCamera();
    };

  }, []);


  const startCamera = async () => {

    try {

      setCameraError("");

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;
      }

      setCameraActive(true);

    } catch (error) {

      console.error(error);

      setCameraError(
        "Camera access was not available. You can still use the demo environment."
      );

    }

  };


  const stopCamera = () => {

    if (streamRef.current) {

      streamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        );

      streamRef.current = null;

    }

    setCameraActive(false);
  };


  const runAssist = () => {

    const result =
      analyzeScenario(
        profile,
        scenario
      );

    setAnalysis(result);

    setAssistRunning(true);

    if (voiceEnabled) {
      speak(
        result.short_instruction ||
          result.recommended_action
      );
    }

  };


  const stopAssist = () => {
    setAssistRunning(false);
  };


  return (
    <div className="live-page">

      <div className="page-intro">

        <span className="eyebrow">
          LIVE PERCEPTION
        </span>

        <h1>
          {t.liveAssist ||
            "Live Assist"}
        </h1>

        <p>
          Point your camera toward the
          environment and let SAHAY guide
          the next step.
        </p>

      </div>


      <div className="live-layout">

        {/* CAMERA */}

        <div className="camera-card">

          <div className="camera-header">

            <div>

              <strong>
                Live environment
              </strong>

              <span>
                {cameraActive
                  ? "Camera active"
                  : "Camera ready"}
              </span>

            </div>


            <div
              className={`camera-status ${
                cameraActive
                  ? "active"
                  : ""
              }`}
            >
              <span />
              {cameraActive
                ? "LIVE"
                : "READY"}
            </div>

          </div>


          <div className="camera-view">

            {cameraActive ? (

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
              />

            ) : (

              <div className="camera-placeholder">

                <div className="camera-placeholder-icon">
                  <Camera size={38} />
                </div>

                <h3>
                  Camera preview
                </h3>

                <p>
                  Start the camera to begin
                  live assistance.
                </p>

              </div>

            )}


            {assistRunning && (
              <div className="live-overlay">

                <span className="live-badge">
                  SAHAY ACTIVE
                </span>

                <div className="scan-line" />

              </div>
            )}

          </div>


          {cameraError && (
            <div className="camera-error">
              {cameraError}
            </div>
          )}


          <div className="camera-actions">

            {!cameraActive ? (

              <button
                className="primary-btn"
                onClick={startCamera}
              >

                <Camera size={18} />

                Start Camera

              </button>

            ) : (

              <button
                className="secondary-btn"
                onClick={stopCamera}
              >

                <X size={18} />

                Stop Camera

              </button>

            )}


            {!assistRunning ? (

              <button
                className="primary-btn"
                onClick={runAssist}
              >

                <Play size={18} />

                {t.startAssist ||
                  "Start Live Assist"}

              </button>

            ) : (

              <button
                className="danger-btn"
                onClick={stopAssist}
              >

                <Pause size={18} />

                {t.stopAssist ||
                  "Stop Assist"}

              </button>

            )}

          </div>

        </div>


        {/* LIVE INFORMATION */}

        <div className="live-information">

          <div className="live-profile-card">

            <span className="section-kicker">
              CURRENT PROFILE
            </span>

            <h3>
              {profile}
            </h3>

            <p>
              SAHAY is adapting guidance
              to this accessibility profile.
            </p>

          </div>


          <div className="scenario-control">

            <span className="section-kicker">
              DEMO SCENARIO
            </span>

            <select
              value={scenario}
              onChange={(e) =>
                setScenario(e.target.value)
              }
            >

              {scenarios.map(
                (item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.label}
                  </option>
                )
              )}

            </select>

          </div>


          {analysis ? (

            <div className="live-guidance">

              <div className="guidance-label">
                <span className="pulse-dot" />
                NOW
              </div>

              <h3>
                {analysis.short_instruction}
              </h3>

              <p>
                {analysis.recommended_action}
              </p>


              <button
                className="voice-action"
                onClick={() =>
                  speak(
                    analysis.short_instruction
                  )
                }
              >

                <Volume2 size={18} />

                Repeat guidance

              </button>

            </div>

          ) : (

            <div className="live-empty">

              <Waypoints size={28} />

              <h3>
                Guidance will appear here
              </h3>

              <p>
                Start Live Assist to receive
                environment-aware guidance.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   READER PAGE
========================================================= */

function ReaderPage({
  t,
  speak,
}) {

  const [text, setText] =
    useState("");

  const [reading, setReading] =
    useState(false);


  const readText = () => {

    if (!text.trim()) return;

    setReading(true);

    speak(text);

    setTimeout(() => {
      setReading(false);
    }, 3000);

  };


  return (
    <div className="simple-page">

      <div className="page-intro">

        <span className="eyebrow">
          TEXT ASSISTANCE
        </span>

        <h1>
          {t.reader || "Read"}
        </h1>

        <p>
          Convert written information into
          spoken guidance.
        </p>

      </div>


      <div className="reader-card">

        <div className="reader-icon">
          <FileText size={28} />
        </div>

        <h2>
          Read aloud
        </h2>

        <p>
          Paste or type text below.
        </p>


        <textarea
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Enter text you want SAHAY to read..."
        />


        <button
          className="primary-btn"
          onClick={readText}
        >

          {reading ? (
            <>
              <Volume2 size={18} />
              Reading...
            </>
          ) : (
            <>
              <Volume2 size={18} />
              Read aloud
            </>
          )}

        </button>

      </div>

    </div>
  );
}


/* =========================================================
   NAVIGATE PAGE
========================================================= */

function NavigatePage({
  t,
  profile,
  speak,
}) {

  const [destination, setDestination] =
    useState("");

  const [started, setStarted] =
    useState(false);


  const startNavigation = () => {

    if (!destination.trim()) return;

    setStarted(true);

    speak(
      `Navigation started to ${destination}. Follow the accessible route.`
    );

  };


  return (
    <div className="simple-page">

      <div className="page-intro">

        <span className="eyebrow">
          ACCESSIBLE ROUTING
        </span>

        <h1>
          {t.navigate ||
            "Navigate"}
        </h1>

        <p>
          Find a route that respects your
          accessibility needs.
        </p>

      </div>


      <div className="navigation-card">

        <div className="navigation-map">

          <div className="map-grid" />

          <div className="map-route">

            <div className="map-start">
              <span />
            </div>

            <div className="route-line" />

            <div className="map-destination">
              <Navigation size={18} />
            </div>

          </div>

        </div>


        <div className="navigation-controls">

          <span className="section-kicker">
            DESTINATION
          </span>

          <input
            value={destination}
            onChange={(e) =>
              setDestination(e.target.value)
            }
            placeholder="Where do you want to go?"
          />


          <div className="route-profile">

            <ShieldCheck size={18} />

            <div>

              <strong>
                Accessible route
              </strong>

              <span>
                Optimized for {profile}
              </span>

            </div>

          </div>


          <button
            className="primary-btn full-width"
            onClick={startNavigation}
          >

            <Navigation size={18} />

            Start navigation

          </button>


          {started && (

            <div className="navigation-status">

              <CheckCircle2 size={20} />

              <div>

                <strong>
                  Route ready
                </strong>

                <span>
                  Follow the accessible
                  path ahead.
                </span>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   HISTORY PAGE
========================================================= */

function HistoryPage({
  t,
  history = [],
}) {

  const historyItems = history.length
    ? history
    : [
        {
          title: "No analyses yet",
          detail: "Run an environment analysis and it will appear here.",
          time: "Ready",
        },
      ];


  return (
    <div className="simple-page">

      <div className="page-intro">

        <span className="eyebrow">
          ACTIVITY
        </span>

        <h1>
          {t.history || "History"}
        </h1>

        <p>
          Your recent accessibility
          assistance sessions.
        </p>

      </div>


      <div className="history-list">

        {historyItems.map(
          (item, index) => (

            <div
              className="history-item"
              key={index}
            >

              <div className="history-icon">
                <History size={19} />
              </div>

              <div className="history-content">

                <strong>
                  {item.title}
                </strong>

                <span>
                  {item.detail}
                </span>

              </div>

              <time>
                {item.time}
              </time>

            </div>

          )
        )}

      </div>

    </div>
  );
}


/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage({
  t,
  language,
  changeLanguage,
  profile,
  setProfile,
  darkMode,
  setDarkMode,
  voiceEnabled,
  setVoiceEnabled,
  handleLogout,
}) {

  return (
    <div className="simple-page">

      <div className="page-intro">

        <span className="eyebrow">
          PREFERENCES
        </span>

        <h1>
          {t.settings || "Settings"}
        </h1>

        <p>
          Personalize how SAHAY works for you.
        </p>

      </div>


      <div className="settings-list">

        {/* LANGUAGE */}

        <div className="setting-row">

          <div className="setting-icon">
            <Languages size={20} />
          </div>

          <div className="setting-content">

            <strong>
              {t.language || "Language"}
            </strong>

            <span>
              Changes interface and voice
              language.
            </span>

          </div>


          <select
            value={language}
            onChange={(e) =>
              changeLanguage(e.target.value)
            }
          >

            {Object.entries(languages).map(
              ([code, lang]) => (
                <option
                  key={code}
                  value={code}
                >
                  {lang.name}
                </option>
              )
            )}

          </select>

        </div>


        {/* PROFILE */}

        <div className="setting-row">

          <div className="setting-icon">
            <Accessibility size={20} />
          </div>

          <div className="setting-content">

            <strong>
              {t.accessibilityProfile ||
                "Accessibility Profile"}
            </strong>

            <span>
              Personalize environmental
              recommendations.
            </span>

          </div>


          <select
            value={profile}
            onChange={(e) =>
              setProfile(e.target.value)
            }
          >

            {profiles.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.title}
                </option>
              )
            )}

          </select>

        </div>


        {/* THEME */}

        <div className="setting-row">

          <div className="setting-icon">

            {darkMode ? (
              <Moon size={20} />
            ) : (
              <Sun size={20} />
            )}

          </div>

          <div className="setting-content">

            <strong>
              {t.theme || "Appearance"}
            </strong>

            <span>
              Choose between light and dark
              appearance.
            </span>

          </div>


          <button
            className="toggle-button"
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >

            {darkMode
              ? "Dark"
              : "Light"}

          </button>

        </div>


        {/* VOICE */}

        <div className="setting-row">

          <div className="setting-icon">

            {voiceEnabled ? (
              <Volume2 size={20} />
            ) : (
              <VolumeX size={20} />
            )}

          </div>

          <div className="setting-content">

            <strong>
              Voice guidance
            </strong>

            <span>
              Spoken accessibility
              instructions.
            </span>

          </div>


          <button
            className={`toggle-button ${
              voiceEnabled
                ? "enabled"
                : ""
            }`}
            onClick={() =>
              setVoiceEnabled(
                !voiceEnabled
              )
            }
          >

            {voiceEnabled
              ? "On"
              : "Off"}

          </button>

        </div>


        {/* LOGOUT */}

        <button
          className="logout-button"
          onClick={handleLogout}
        >

          <LogOut size={18} />

          Log out

        </button>

      </div>

    </div>
  );
}


/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  icon: Icon,
  label,
  active,
  onClick,
}) {

  return (
    <button
      className={`sidebar-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >

      <Icon size={19} />

      <span>
        {label}
      </span>

    </button>
  );
}


/* =========================================================
   MOBILE NAV ITEM
========================================================= */

function MobileNavItem({
  icon: Icon,
  label,
  active,
  onClick,
}) {

  return (
    <button
      className={`mobile-nav-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >

      <Icon size={19} />

      <span>
        {label}
      </span>

    </button>
  );
}