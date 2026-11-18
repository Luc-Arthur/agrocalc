# 🌱 AgroCalc

Calculateurs agronomiques en ligne : **semis, chaulage, fumure NPK et conversions d'unités**. On entre ses valeurs, le résultat s'affiche tout de suite, avec la formule utilisée.

🔗 **Démo :** [luc-arthur.github.io/agrocalc](https://luc-arthur.github.io/agrocalc/)

> 🚧 **En construction.** Projet de ma série « un projet par semaine ». Je suis étudiant en agronomie à l'UFSM (Santa Maria, Brésil) et développeur web.

---

## 🗺️ Feuille de route

- [x] Structure de l'application et mise en ligne automatique sur GitHub Pages
- [x] Semis : kg de semences par hectare, graines par mètre de rang
- [x] Chaulage : t de calcaire par hectare (saturation par bases), jauge de saturation
- [ ] Fumure NPK : kg d'engrais commercial par hectare
- [ ] Conversions : hectare, m², alqueire, sacs par hectare
- [ ] Irrigation : besoin en eau (mm/jour) et temps d'arrosage — idée proposée en commentaire LinkedIn
- [ ] Interface en français et en portugais
- [ ] Tests des formules et version 1.0

## 🛠️ Stack

Vue 3 (Composition API) · TypeScript · Vue Router · Tailwind CSS 4 · Vite · Vitest · GitHub Actions + GitHub Pages

## 🚀 Lancer en local

```bash
git clone https://github.com/Luc-Arthur/agrocalc.git
cd agrocalc
npm install
npm run dev
npm test   # tests des formules
```

## ⚠️ Avertissement

Les résultats sont des estimations à visée pédagogique. Ils ne remplacent pas une analyse de sol ni les recommandations officielles de votre région (par exemple le Manuel de calagem et adubação RS/SC).

---

**Luc-Arthur LAWALE** · [LinkedIn](https://www.linkedin.com/in/luc-arthur-lawale-00a489334)
