import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Opsi Tambahan: Menyesuaikan Rules
  {
    rules: {
      // Jika Anda SANGAT terpaksa menggunakan <img> biasa dan ingin mematikan warningnya:
      // "@next/next/no-img-element": "off",

      // Peringatan useEffect dependencies (sangat disarankan tetap "warn" atau "error")
      // "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;