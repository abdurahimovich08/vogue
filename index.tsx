
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("VogueAI: Ilova yuklanmoqda...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("VogueAI: Root element topilmadi!");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("VogueAI: Render muvaffaqiyatli chaqirildi.");
  } catch (err) {
    console.error("VogueAI: Renderlashda xatolik:", err);
  }
}
