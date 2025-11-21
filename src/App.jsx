import React, { useState, useEffect } from "react";

const API_URL = 'https://www.udemy.com/api-2.0/courses';

async function getCourseDataFromServer(id) {
  if (!id) {
    throw new Error('Course ID not found');
  }
  
  try {
    const res = await fetch(
      `${API_URL}/${id}/?fields[course]=created,last_update_date,title`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      }
    );
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (e) {
    console.warn('Error fetching creation date:', e.message);
    throw e;
  }
}

function extractCourseIdFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const courseIndex = pathParts.indexOf('course');
    if (courseIndex !== -1 && pathParts[courseIndex + 1]) {
      return pathParts[courseIndex + 1].split('?')[0];
    }
    return null;
  } catch (e) {
    return null;
  }
}

const palette = {
  background: "#f4f6fb",
  card: "#ffffff",
  primary: "#5624d0",
  secondary: "#17a2b8",
  success: "#0f5132",
  warning: "#b45309",
  danger: "#b42318",
  text: "#1f2933",
  muted: "#6a6f73"
};

const baseCardStyle = {
  background: palette.card,
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 15px 35px rgba(15, 23, 42, 0.08)",
  border: "1px solid rgba(86, 36, 208, 0.08)"
};

export function App() {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUdemyPage, setIsUdemyPage] = useState(false);

  useEffect(() => {
    const styleId = "udemy-popup-animations";
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab || !tab.url) {
          setError('Could not get current tab information');
          setLoading(false);
          return;
        }

        const url = tab.url;
        
        // Check if it's a Udemy course page
        if (!url.includes('udemy.com/course/')) {
          setIsUdemyPage(false);
          setLoading(false);
          return;
        }

        setIsUdemyPage(true);
        const courseId = extractCourseIdFromUrl(url);
        
        if (!courseId) {
          setError('Could not extract course ID from URL');
          setLoading(false);
          return;
        }

        const data = await getCourseDataFromServer(courseId);
        setCourseData(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch course data');
      } finally {
        setLoading(false);
      }
    }

    fetchCourseData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div
      style={{
        minHeight: "22rem",
        width: "24rem",
        padding: "24px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        background: `radial-gradient(circle at top, rgba(86, 36, 208, 0.14), transparent 55%), ${palette.background}`,
        color: palette.text
      }}
    >
      <div style={{ ...baseCardStyle }}>
        <header style={{ textAlign: "center", marginBottom: "18px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              margin: "0 auto 12px auto",
              background: `linear-gradient(135deg, ${palette.primary}, #7a3ff2)`,
              color: "#fff",
              fontWeight: "700",
              fontSize: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 24px rgba(86, 36, 208, 0.35)"
            }}
          >
            U
          </div>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              margin: "0 0 6px 0",
              color: palette.text
            }}
          >
            Udemy Course Insights
          </h1>
          <p
            style={{
              margin: 0,
              color: palette.muted,
              fontSize: "14px",
              lineHeight: 1.5
            }}
          >
            Quickly confirm if you're looking at a truly new Udemy course.
          </p>
        </header>

        {!isUdemyPage && (
          <div
            style={{
              ...baseCardStyle,
              padding: "16px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #fdf2ff, #f6f8ff)",
              border: "1px solid rgba(86, 36, 208, 0.15)",
              boxShadow: "none"
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: "15px",
                marginBottom: "6px",
                color: palette.primary
              }}
            >
              Not on Udemy yet
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.5,
                color: palette.text
              }}
            >
              Open any Udemy course page and refresh this popup to see the real
              creation date instantly.
            </p>
          </div>
        )}

        {isUdemyPage && (
          <section style={{ marginTop: "18px" }}>
            {loading && (
              <div
                style={{
                  ...baseCardStyle,
                  borderRadius: "14px",
                  border: "1px solid rgba(23, 162, 184, 0.2)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, rgba(23,162,184,0.2), rgba(86,36,208,0.15))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <span
                      style={{
                        width: "22px",
                        height: "22px",
                        border: "3px solid rgba(23,162,184,0.35)",
                        borderTopColor: palette.secondary,
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }}
                    ></span>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: palette.secondary
                      }}
                    >
                      Gathering course details
                    </div>
                    <div
                      style={{
                        width: "140px",
                        height: "12px",
                        marginTop: "10px",
                        borderRadius: "999px",
                        background:
                          "linear-gradient(90deg, rgba(23,162,184,0.15) 0%, rgba(23,162,184,0.4) 50%, rgba(23,162,184,0.15) 100%)",
                        backgroundSize: "200% 100%",
                        animation: "pulse 1.2s ease-in-out infinite"
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {!loading && error && (
              <div
                style={{
                  ...baseCardStyle,
                  borderRadius: "14px",
                  border: "1px solid rgba(180, 35, 24, 0.2)",
                  background: "linear-gradient(135deg, #fff5f5, #ffe7e7)"
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: palette.danger,
                    marginBottom: "6px"
                  }}
                >
                  Something went wrong
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    lineHeight: 1.5,
                    color: palette.danger
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {!loading && !error && !courseData && (
              <div
                style={{
                  ...baseCardStyle,
                  borderRadius: "14px",
                  border: "1px solid rgba(180, 83, 9, 0.2)",
                  background: "linear-gradient(135deg, #fff9f1, #fff4e5)"
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: palette.warning,
                    marginBottom: "6px"
                  }}
                >
                  Couldn’t fetch data
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    lineHeight: 1.5,
                    color: palette.warning
                  }}
                >
                  The creation date might still be visible on the course page
                  itself.
                </p>
              </div>
            )}

            {!loading && courseData && (
              <div
                style={{
                  ...baseCardStyle,
                  borderRadius: "16px",
                  background:
                    "linear-gradient(135deg, rgba(86,36,208,0.08), rgba(56,142,60,0.12))"
                }}
              >
                {courseData.title && (
                  <h2
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: "17px",
                      fontWeight: 600,
                      color: palette.text,
                      lineHeight: 1.4
                    }}
                  >
                    {courseData.title}
                  </h2>
                )}
                <div
                  style={{
                    borderRadius: "14px",
                    padding: "16px",
                    background: "#ffffff",
                    border: "1px solid rgba(15,81,50,0.16)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "10px"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        color: palette.success,
                        textTransform: "uppercase"
                      }}
                    >
                      Created
                    </span>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background: "rgba(15,81,50,0.08)",
                        color: palette.success
                      }}
                    >
                      Verified
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: palette.success,
                      lineHeight: 1.3
                    }}
                  >
                    {formatDate(courseData.created)}
                  </div>
                  <div
                    style={{
                      marginTop: "14px",
                      paddingTop: "12px",
                      borderTop: "1px solid rgba(15,81,50,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      flexWrap: "wrap"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        color: palette.muted,
                        textTransform: "uppercase"
                      }}
                    >
                      Updated
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: palette.primary
                      }}
                    >
                      {formatDate(courseData.last_update_date)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        <footer
          style={{
            marginTop: "20px",
            textAlign: "center",
            padding: "14px 0 4px 0",
            borderTop: "1px solid rgba(106, 111, 115, 0.14)"
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "13px",
              color: palette.muted
            }}
          >
            Enjoying Udemy Course Insights?
          </p>
          <a
            href="https://chromewebstore.google.com/detail/udemy-course-insights/ndcegcfnihfkgknkbhhckenmfdbpfiod"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              background: "rgba(86,36,208,0.08)",
              color: palette.primary,
              border: "1px solid rgba(86,36,208,0.18)"
            }}
          >
            Leave a quick review
            <span style={{ fontSize: "16px", lineHeight: 1 }}>⭐</span>
          </a>
        </footer>
      </div>
    </div>
  );
}

