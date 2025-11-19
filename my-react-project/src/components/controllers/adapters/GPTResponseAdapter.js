// 📁 File: src/components/adapters/GPTResponseAdapter.js

class GPTResponseAdapter {
  static parse(rawText) {
    const defaultResult = {
      restaurants: [],
      concerts: [],
      sports: []
    };

    if (!rawText || typeof rawText !== 'string') return defaultResult;

    try {
      // Some models return triple-backtick JSON, we clean it first
      const cleanJson = rawText
        .replace(/```json|```/g, '')
        .trim();

      const parsed = JSON.parse(cleanJson);

      return {
        restaurants: Array.isArray(parsed.restaurants) ? parsed.restaurants : [],
        concerts: Array.isArray(parsed.concerts) ? parsed.concerts : [],
        sports: Array.isArray(parsed.sports) ? parsed.sports : []
      };
    } catch (e) {
      console.warn("⚠️ GPT response is not valid JSON. Falling back to keyword-based parsing.");
      
      // fallback to previous logic (in case it's not valid JSON, still try to extract)
      const result = { ...defaultResult };
      const lines = rawText.split('\n').map(line => line.trim()).filter(Boolean);
      let currentCategory = null;

      for (let line of lines) {
        if (/^restaurants[:]?$/i.test(line)) {
          currentCategory = 'restaurants';
        } else if (/^concerts[:]?$/i.test(line)) {
          currentCategory = 'concerts';
        } else if (/^sports[:]?$/i.test(line)) {
          currentCategory = 'sports';
        } else if (/^[0-9]+[.)]/.test(line) && currentCategory) {
          const clean = line.replace(/^[0-9]+[.)]\s*/, '');
          result[currentCategory].push(clean);
        }
      }

      return result;
    }
  }
}

export default GPTResponseAdapter;