# The Candor — "Graphite & Ember"

The design system behind thecandor.in. Read this before changing any styling.

**The one rule:** `_sass/_tokens.scss` is the single source of truth. No file outside
it may contain a hex value, and no file anywhere may contain a `px`. If you need a
colour or a size that doesn't exist, add a token — don't inline a literal.

The one exception: the two `theme-color` metas in `_layouts/default.html` cannot read
a custom property, so they repeat the light and dark `--c-canvas` values. Change them
together.

---

## The idea

A tech blog that is easy to read first and good-looking second. One centred column,
two typefaces, a light theme and a dark theme. Graphite neutrals, one warm accent used
sparingly, and generous space around long-form text and code. Confidence, not decoration.

Every page uses the same column (`--w-page: 45rem`): masthead, lists, prose and footer
share the same two edges. At body size that column holds about 70 characters a line.

Two rationed textures give it physicality, never stacked:

1. **Grain**: a fixed 2.8%-opacity fractal-noise film over the canvas. Zero image weight.
2. **Hairline grid**: footer only, radially masked.

---

## Colour

Light is the default. Dark applies when the system asks for it
(`prefers-color-scheme: dark`) or when the reader picks it with the masthead toggle.
The toggle stores `localStorage.theme` and sets `[data-theme]` on `<html>`; an inline
script in `<head>` applies the stored choice before first paint.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--c-canvas` | `#FBFBF9` | `#101215` | the page |
| `--c-canvas-sunk` | `#F3F3F0` | `#0B0D0F` | code blocks, inputs, footer |
| `--c-surface` | `#FFFFFF` | `#181B20` | cards, raised panels |
| `--c-surface-hi` | `#F6F6F3` | `#1E2228` | hover state of a surface |
| `--c-hairline` | `#E4E4DF` | `#262A31` | rules and borders |
| `--c-ink` | `#15171A` | `#ECEDEE` | headings |
| `--c-ink-soft` | `#2A2D33` | `#D5D8DD` | long-form prose |
| `--c-muted` | `#5A606A` | `#A0A6B0` | excerpts, meta lines |
| `--c-faint` | `#676D78` | `#8C929D` | separators, list numerals |
| `--c-ember` | `#C2410C` | `#FF7A45` | **the** accent: CTAs, marks, active state |
| `--c-cyan` | `#0B5CAD` | `#6CC8E0` | links |
| `--grad-signature` | ember → rose → cyan | | progress bar, band edge, 404 |

**A new colour needs both values.** Add it to `:root` and to the `dark-palette` mixin
in `_sass/_tokens.scss`. A component never asks which theme is active; it reads tokens.

**Contrast is a hard constraint, not a preference.** Every grey above is used for real
text, and every one clears WCAG AA in both themes. `--c-faint` is the floor (5.0:1 on
the light canvas). Nothing may be quieter than it. If you add a grey, run the contrast
check before you commit it.

**Accent discipline.** Ember appears at most a few times per screen: one primary
button, the active nav underline, a hovered title, the blockquote bar. If a page feels
like it has a lot of orange on it, it is wrong.

## Type

- **Inter**: prose, headings and interface
- **JetBrains Mono**: code, `kbd`, and numerals that must line up

Two faces, no more. A tech post mixes prose, inline code and code blocks in every
paragraph; one sans for the text and one mono for the code keeps that mix calm. Code
turns ligatures off (`"liga" 0, "calt" 0`), because `!=` must look like `!=`.

| Token | Size (phone → desktop) | Use |
|---|---|---|
| `--fs-h1` | 1.625 → 2rem | home statement, page titles |
| `--fs-title` | 1.5 → 1.875rem | post title |
| `--fs-h2` | 1.25 → 1.4375rem | section heading in a post |
| `--fs-h3` | 1.125 → 1.25rem | sub-heading, titles in the post index |
| `--fs-lead` | 1.125 → 1.25rem | deck under a title |
| `--fs-body` | 1.0625 → 1.125rem | prose, at line-height 1.7 |
| `--fs-sm` / `--fs-xs` | 1rem / 0.9375rem | excerpts, tables / nav, buttons |
| `--fs-micro` | 0.875rem | meta lines, code blocks, captions |

Headings stay close to body size on purpose. A post title is one clear step above
`h2`, not a poster: a long headline must hold to two lines so the essay starts on the
first screen. Headings use `text-wrap: balance`, paragraphs `pretty`.

No uppercase labels and no mono for interface text. A date, a topic and a reading time
are one quiet sentence-case line (`.meta`).

> **`clamp()` may only appear inside a token.** GitHub Pages builds this with Ruby
> Sass 3.7, which evaluates maths in ordinary declarations and dies on `1rem + 2vw`.
> Custom-property values pass through untouched. So every fluid size is a `--fs-*`
> token consumed via `var()`. Inline a `clamp()` in a normal rule and the production
> build breaks — the local one will too, which is the point.

## Space, shape, motion

**Three gaps set the pace of every page.** Use them; do not pick a step by eye.

| Token | Desktop | Phone | Use |
|---|---|---|---|
| `--sp-top` | 3.5rem | 2rem | masthead to the first line of content |
| `--sp-section` | 4rem | 3rem | one section to the next, and the last section to the footer |
| `--sp-head` | 1.5rem | 1.5rem | a ruled heading (`.section-head`) to the content it names |

A list gives up the outer padding of its first and last row, so the gap around the
list always comes from one of these three tokens, not from a sum of paddings. Inside a
group the steps are 0.5rem (a title and its summary), 1rem (related lines) and 1.5rem
(rows and paragraphs). In prose a heading has about four times the air above as below.

`--sp-1` … `--sp-12` on a `0.25rem` base. Radii `--r-xs` … `--r-full`. Elevation
`--e-1/2/3`, plus `--glow-ember` — used in exactly one place (the primary button),
because a glow everywhere is a glow nowhere.

Motion animates **`transform` and `opacity` only**, so it can never trigger layout.
Durations 120/200/400ms on `--ease`. Everything is disabled under
`prefers-reduced-motion` by a single global kill switch in `_base.scss` — components
must not re-declare their own opt-out.

## Components

`.btn` (`--primary` / `--ghost` / `--sm`) · `.card` · `.chip` · `.meta` · `.callout`
· `.field` · `.pagination` · `.avatar-ring` · `.section-head` · `.prose`.

The home page is three parts in one column: the intro (statement, two lines, and one
author card with the social links), the post index (`.entries`: date and facts on the
left, title and summary on the right, stacked on a phone), and About.

`.meta` is the one line of facts about a post: date · topic · length. Each child is one
item; the dot trails the item, so a wrapped line never starts with a separator.

`.prose` is the contract for everything inside a post body: headings, lists with muted
markers, ember-barred blockquotes, inline code, `kbd`, captioned images, and tables
that scroll inside themselves so the page never does. `prose_style: numbered` in a
post's front matter turns a post that is one long list into ruled, numbered items.

### Code blocks

A fenced block renders as a frame (`div.highlighter-rouge`). `site.js` adds a bar with
the language name and a Copy button. Without JS the block is still a complete frame.
A long line scrolls inside the block. Syntax colours are tokens (`_sass/_syntax.scss`),
so they follow the theme.

## Mobile

Not an afterthought — a gate. Enforced and verified:

- Tap targets ≥ 44px, via the `@include touch` mixin (`hover: none`), not a width guess.
  Links that are *words in a sentence* are exempt: padding them out would wreck the
  line rhythm.
- Inputs render at ≥ 16px on phones, or iOS zooms the page on focus.
- No horizontal scroll at any width. Code blocks and tables scroll inside themselves.
- The floating TOC appears only above `80rem`, where there is genuinely room. Below
  that it does not exist — no cramped two-column compromise.

## Verifying a change

The dev loop is pinned to **`github-pages` 232 / Jekyll 3.10 under Ruby 3.3**, which is
exactly what GitHub builds the live site with — local really does equal production.
Homebrew's default Ruby is too new for that stack, hence the explicit path.

```bash
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
bundle install
bundle exec jekyll serve --livereload      # http://127.0.0.1:4000
```

Then **look at the rendered pixels** — screenshot every page at 390 / 768 / 1440 in
both themes and check the result, rather than reading the stylesheet and assuming. Class-level review
does not catch a title that silently runs into its own excerpt.
