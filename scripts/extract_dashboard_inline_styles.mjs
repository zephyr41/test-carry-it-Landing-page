import fs from "node:fs"

const htmlPath = "dashboard.html"
const cssPath = "assets/css/dashboard.css"
const prefix = "dbx-inline"
const markerStart = "/* -- Extracted dashboard inline styles: start -- */"
const markerEnd = "/* -- Extracted dashboard inline styles: end -- */"

let html = fs.readFileSync(htmlPath, "utf8")
let css = fs.readFileSync(cssPath, "utf8")

if (!process.argv.includes("--force") && css.includes(markerStart) && html.includes(`${prefix}-`)) {
  console.log("Dashboard inline style extraction is already present. Use --force from a clean pre-extraction state to regenerate.")
  process.exit(0)
}

css = css.replace(
  new RegExp(`\\n?${escapeRegExp(markerStart)}[\\s\\S]*?${escapeRegExp(markerEnd)}\\n?`, "g"),
  "\n"
)

const styles = new Map()

function normalizeStyle(style) {
  return style
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s*;\s*/g, ";")
    .replace(/;?$/, ";")
}

function classFor(style) {
  const normalized = normalizeStyle(style)
  if (!styles.has(normalized)) {
    styles.set(normalized, `${prefix}-${String(styles.size + 1).padStart(3, "0")}`)
  }
  return styles.get(normalized)
}

html = html.replace(/<([A-Za-z][\w:-]*)([^<>]*?)\sstyle="([^"]*)"([^<>]*?)>/g, (tag, name, before, style, after) => {
  if (style.includes("${")) {
    return tag
  }

  const className = classFor(style)
  let next = `<${name}${before}${after}>`

  if (/\sclass="/.test(next)) {
    next = next.replace(/\sclass="([^"]*)"/, (_match, existing) => {
      const classes = new Set(existing.split(/\s+/).filter(Boolean))
      classes.add(className)
      return ` class="${Array.from(classes).join(" ")}"`
    })
  } else {
    next = next.replace(/>$/, ` class="${className}">`)
  }

  return next
})

html = html.replace("assets/css/dashboard.css?v=71", "assets/css/dashboard.css?v=72")

const extractedCss = [
  markerStart,
  ...Array.from(styles.entries()).map(([style, className]) => `.${className} { ${style} }`),
  markerEnd,
  "",
].join("\n")

fs.writeFileSync(htmlPath, html)
fs.writeFileSync(cssPath, `${css.trimEnd()}\n\n${extractedCss}`)

console.log(`Extracted ${styles.size} unique inline style blocks.`)

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
