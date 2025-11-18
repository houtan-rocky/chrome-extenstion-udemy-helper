import React, { useState, useEffect } from "react";

const API_URL = 'https://www.udemy.com/api-2.0/courses';

async function getCourseDataFromServer(id) {
  if (!id) {
    throw new Error('Course ID not found');
  }
  
  try {
    const res = await fetch(
      `${API_URL}/${id}/?fields[course]=created,title`,
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

export function App() {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUdemyPage, setIsUdemyPage] = useState(false);

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
    <div style={{ 
      minHeight: "20rem", 
      width: "22rem",
      padding: "24px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      background: "#ffffff",
      color: "#333333"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ 
          fontSize: "24px", 
          fontWeight: "700", 
          marginBottom: "12px",
          marginTop: "0",
          color: "#333333"
        }}>
          Udemy Course Insights
        </h1>

        {!isUdemyPage && (
          <div style={{
            background: "#f0f0f0",
            padding: "16px",
            borderRadius: "8px",
            marginTop: "20px",
            color: "#555555"
          }}>
            <p style={{ 
              fontSize: "14px", 
              margin: "0",
              lineHeight: "1.5"
            }}>
              Visit a Udemy course page to see the creation date.
            </p>
          </div>
        )}

        {isUdemyPage && loading && (
          <div style={{
            background: "#e0f7fa",
            padding: "16px",
            borderRadius: "8px",
            marginTop: "20px",
            color: "#00796b"
          }}>
            <p style={{ 
              fontSize: "14px", 
              margin: "0",
              lineHeight: "1.5"
            }}>
              Loading course data...
            </p>
          </div>
        )}

        {isUdemyPage && error && (
          <div style={{
            background: "#ffebee",
            padding: "16px",
            borderRadius: "8px",
            marginTop: "20px",
            color: "#c62828"
          }}>
            <p style={{ 
              fontSize: "14px", 
              margin: "0",
              lineHeight: "1.5"
            }}>
              ⚠️ {error}
            </p>
          </div>
        )}

        {isUdemyPage && courseData && (
          <div style={{
            background: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            marginTop: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            {courseData.title && (
              <h2 style={{ 
                fontSize: "18px", 
                fontWeight: "600",
                margin: "0 0 16px 0",
                lineHeight: "1.4",
                color: "#333333"
              }}>
                {courseData.title}
              </h2>
            )}
            <div style={{
              background: "#e8f5e9",
              padding: "12px",
              borderRadius: "6px",
              marginTop: "12px",
              border: "1px solid #c8e6c9"
            }}>
              <div style={{ 
                fontSize: "15px", 
                fontWeight: "600",
                marginBottom: "8px",
                color: "#2e7d32"
              }}>
                Real Creation Date
              </div>
              <div style={{ 
                fontSize: "20px", 
                fontWeight: "700",
                color: "#388e3c"
              }}>
                {formatDate(courseData.created)}
              </div>
            </div>
          </div>
        )}

        {!loading && !error && !courseData && isUdemyPage && (
          <div style={{
            background: "#fff3e0",
            padding: "16px",
            borderRadius: "8px",
            marginTop: "20px",
            color: "#e65100"
          }}>
            <p style={{ 
              fontSize: "14px", 
              margin: "0",
              lineHeight: "1.5"
            }}>
              Could not fetch course data. The creation date may still be visible on the course page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

