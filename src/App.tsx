/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Articles } from "./pages/Articles";
import { AI } from "./pages/AI";
import { Queries } from "./pages/Queries";
import { Admin } from "./pages/Admin";
import { useEffect } from "react";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { db } from "./lib/firebase";

export default function App() {
  // Track page visits
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const analyticsRef = doc(db, 'analytics', 'global');
        const snap = await getDoc(analyticsRef);
        if (!snap.exists()) {
          await setDoc(analyticsRef, { visits: 1 });
        } else {
          await setDoc(analyticsRef, { visits: increment(1) }, { merge: true });
        }
      } catch (err) {
        console.error("Error tracking visit:", err);
      }
    };
    trackVisit();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="articles" element={<Articles />} />
          <Route path="ai" element={<AI />} />
          <Route path="queries" element={<Queries />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </Router>
  );
}
