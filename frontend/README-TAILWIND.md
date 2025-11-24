# Setup: Tailwind & Running the App (Windows PowerShell)

This project uses Create React App. Follow these steps to add Tailwind CSS and run the app locally.

1. Install Tailwind and PostCSS (dev dependencies):

```powershell
cd "E:\Ambition Futsal System\ambition"
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Configure `tailwind.config.js` `content` paths:

```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: { extend: {} },
  plugins: [],
};
```

3. Add Tailwind directives to `src/index.css` at the top:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. Start development server:

```powershell
npm install
npm start
```

5. Run tests once (non-watch mode):

```powershell
npm test -- --watchAll=false
```

Notes:

- If you already have Tailwind configured, you can skip the setup steps.
- The UI components are styled using Tailwind classes. If styles don't appear, ensure `index.css` includes the Tailwind directives and `tailwind.config.js` `content` paths point to `./src`.
