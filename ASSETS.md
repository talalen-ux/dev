# Figma assets

Source file: [PinLink](https://www.figma.com/design/yBLU5kTeT7WHKFRLVbd7Ov/PinLink?node-id=4361-18)
· page **🟢 Website** · frame **Desktop / dark mode** (`4361:19`)

## Status

Two constraints stopped the remaining assets from being exported:

1. **`www.figma.com` is blocked by this environment's egress policy** (403 on
   CONNECT), so the asset URLs the Figma MCP server returns cannot be fetched
   with `curl`. Assets have to come back through the MCP channel instead,
   base64-encoded via `exportAsync`.
2. **The Figma Starter plan allows 20 MCP tool calls per month**, and that
   quota is now spent. Further reads need the quota to reset or the plan to be
   upgraded to Pro/Organization/Enterprise with a Full or Dev seat.

## Real, exported from Figma

| File | Node | Notes |
| --- | --- | --- |
| `public/assets/pinlink-lockup.svg` | `4454:525` | Full logo lockup, 151×36 |
| `public/assets/pinlink-mark.svg`, `icons/mark.svg` | `4454:527` | Brand mark split out of the lockup, 36×36 |

## Reproduced exactly (not exported, but not a guess)

| File | Node | Notes |
| --- | --- | --- |
| `icons/tokenomics-dot.svg` | `4373:315` | Plain 16×16 ellipse filled `#C1FF72` |

## Provisional — must be replaced

Each has the designed outer box so layout geometry is already correct; only the
artwork inside is a stand-in (dashed outline, marked `PROVISIONAL` in the file).

| File | Node | Size |
| --- | --- | --- |
| `icons/nav-arrow.svg` | `4373:403` | 20×20 |
| `icons/powered-by-ai.svg` | `4361:102` | 16×16 |
| `icons/rwa-fractionalization.svg` | `4361:108` | 16×16 |
| `icons/depin-tokenization.svg` | `4361:114` | 16×16 |
| `icons/increased-income.svg` | `4361:149` | 24×24 |
| `icons/attracting-capital.svg` | `4361:154` | 24×24 |
| `icons/lower-costs.svg` | `4361:159` | 24×24 |
| `icons/more-income-sources.svg` | `4361:164` | 24×24 |
| `icons/social-menu.svg` | `4361:420` | 600×20 |
| `icons/docs.svg` | `4373:902` | 28×20 |
| `hero-gpu.svg` | `4373:1410` | 1248×503 raster (`GeForce-ADA-RTX4080-Front 1`) |
| `how-it-works.svg` | `4454:309` | 1248×640 flow diagram |

## Replacing them

Fastest route, no quota needed: select the node in Figma and use **Export** in
the right-hand panel — SVG for the icons and the flow diagram, PNG for the GPU
render. Save over the file of the same name (change the `hero-gpu` /
`how-it-works` extensions to `.png` and update the two `Image` `src` values).

With quota available, one `use_figma` call exports the whole set:

```js
const page = await figma.getNodeByIdAsync('4361:18');
await figma.setCurrentPageAsync(page);
const targets = [
  ['nav-arrow', '4373:403'], ['powered-by-ai', '4361:102'],
  ['rwa-fractionalization', '4361:108'], ['depin-tokenization', '4361:114'],
  ['increased-income', '4361:149'], ['attracting-capital', '4361:154'],
  ['lower-costs', '4361:159'], ['more-income-sources', '4361:164'],
  ['social-menu', '4361:420'], ['docs', '4373:902'],
  ['how-it-works', '4454:309'],
];
const out = {};
for (const [name, id] of targets) {
  const n = await figma.getNodeByIdAsync(id);
  const bytes = await n.exportAsync({ format: 'SVG' });
  out[name] = figma.base64Encode(bytes);
}
return out;
```

## Sections not yet read from Figma

Design context was retrieved for 13 of the 16 visible sections. These three were
built from layer metadata and the page-level screenshot, so their copy is right
but the layout is inferred and should be checked against the file:

- `4454:309` — How PinLink works (flow diagram)
- `4373:147` — closing wordmark + tagline
- `4373:123` — footer

Two frames on the page are hidden (`visible: false`) and were deliberately
skipped: `6968:74` (an alternate "Introducing" ticker) and `4361:497` (an older
Team section without the `[X]` links; `4371:55` is the rendered one).
