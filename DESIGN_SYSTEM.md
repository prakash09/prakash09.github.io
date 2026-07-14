# The Candor — "Graphite & Ember"

The design system behind thecandor.in. Read this before changing any styling.

**The one rule:** `_sass/_tokens.scss` is the single source of truth. No file outside
it may contain a hex value, and no file anywhere may contain a `px`. If you need a
colour or a size that doesn't exist, add a token — don't inline a literal.

---

## The idea

A dark, editorial site for someone who has actually built and sold things. It should
read as engineering-grade and restrained: near-black graphite, one warm accent used
sparingly, mono type for anything that is data (dates, categories, reading time), and
generous space around long-form text. Confidence, not decoration.

Three rationed textures give it physicality — one per region, never stacked:

1. **Grain** — a fixed 2.8%-opacity fractal-noise film over the canvas. Kills gradient
   banding on dark and makes the surface feel like a material. Zero image weight.
2. **Aurora** — two very low-alpha radials behind the hero only. The one lit region.
3. **Hairline grid** — footer only, 3% opacity, radially masked.

---

## Colour

| Token | Value | Use |
|---|---|---|
| `--c-canvas` | `#0B0C0E` | the page |
| `--c-canvas-sunk` | `#08090A` | code blocks, inputs, footer |
| `--c-surface` | `#131519` | cards, raised panels |
| `--c-surface-hi` | `#181B20` | hover state of a surface |
| `--c-hairline` | `#23262C` | 1px rules and borders |
| `--c-hairline-hi` | `#2E323A` | hovered border |
| `--c-ink` | `#ECEDEE` | body and headings |
| `--c-ink-soft` | `#C3C7CC` | long-form prose |
| `--c-muted` | `#8B9099` | excerpts, secondary meta |
| `--c-faint` | `#808691` | dates, kickers, idle TOC links |
| `--c-ember` | `#FF7A45` | **the** accent — CTAs, marks, active state |
| `--c-cyan` | `#58C4DC` | links |
| `--grad-signature` | ember → rose → cyan | progress bar, band edge, 404 |

**Contrast is a hard constraint, not a preference.** Every one of the greys above is
used for real text, and every one clears WCAG AA against both `--c-canvas` and
`--c-surface`. `--c-faint` is the floor at 5.4:1 — nothing may be quieter than it.
If you add a grey, run the contrast check before you commit it.

**Accent discipline.** Ember appears at most a few times per screen: one primary
button, the section ticks, the active nav underline, one word in the hero. If a page
feels like it has a lot of orange on it, it is wrong.

## Type

- **Inter Tight** — display and headings
- **Inter** — body
- **JetBrains Mono** — kickers, dates, tags, code, anything that is *data*

Body is `1.1875rem / 1.75`, and prose is capped at `--w-prose: 68ch`. Headings use
`text-wrap: balance`, paragraphs `pretty`.

> **`clamp()` may only appear inside a token.** GitHub Pages builds this with Ruby
> Sass 3.7, which evaluates maths in ordinary declarations and dies on `1rem + 2vw`.
> Custom-property values pass through untouched. So every fluid size is a `--fs-*`
> token consumed via `var()`. Inline a `clamp()` in a normal rule and the production
> build breaks — the local one will too, which is the point.

## Space, shape, motion

`--sp-1` … `--sp-12` on a `0.25rem` base. Radii `--r-xs` … `--r-full`. Elevation
`--e-1/2/3`, plus `--glow-ember` — used in exactly one place (the primary button),
because a glow everywhere is a glow nowhere.

Motion animates **`transform` and `opacity` only**, so it can never trigger layout.
Durations 120/200/400ms on `--ease`. Everything is disabled under
`prefers-reduced-motion` by a single global kill switch in `_base.scss` — components
must not re-declare their own opt-out.

## Components

`.btn` (`--primary` / `--ghost` / `--sm`) · `.card` · `.chip` · `.kicker` · `.callout`
· `.field` · `.pagination` · `.avatar-ring` · `.section-head` · `.prose`.

`.prose` is the contract for everything inside a post body: headings with an ember
tick, ember list markers, ember-barred blockquotes, captioned images, and tables that
scroll inside themselves so the page never does.

### `.reveal`

Fade-and-rise on scroll, driven by IntersectionObserver. It is scoped to `.js`, which
an inline script in `<head>` sets — so content is hidden **only** when JS is running
and can be relied on to reveal it again. If the script fails, nothing is stranded at
`opacity: 0`.

## Mobile

Not an afterthought — a gate. Enforced and verified:

- Tap targets ≥ 44px, via the `@include touch` mixin (`hover: none`), not a width guess.
  Links that are *words in a sentence* are exempt: padding them out would wreck the
  line rhythm.
- Inputs render at ≥ 16px on phones, or iOS zooms the page on focus.
- No horizontal scroll at any width. Decorations (the aurora) are clipped to their
  section and can never widen the document.
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

Then **look at the rendered pixels** — screenshot every page at 390 / 768 / 1440 and
check the result, rather than reading the stylesheet and assuming. Class-level review
does not catch a title that silently runs into its own excerpt.
