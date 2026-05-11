# XP Estudantil — Design System

> Estética **Rubber Hose / Cuphead** (cartoon vintage anos 30): contornos pretos grossos, sombras offset sólidas, paleta saturada e tipografia display de impacto.

---

## 1. Filosofia de Design

- **Tom**: cartoon vintage, lúdico, alto contraste, com textura de papel envelhecido.
- **Princípios visuais**:
  - Lineart preto forte (`border-[3px] border-foreground`) em quase todos os cards e botões.
  - Sombras "cartoon" sólidas e deslocadas (offset shadows), nunca difusas.
  - Cantos arredondados generosos (`rounded-2xl` / `rounded-3xl`).
  - Fundo amarelo "tinta" como assinatura da marca no modo claro.
  - Animações exageradas (wobble, float, coin-flip) para reforçar o caráter rubber hose.

> ⚠️ **Regra de ouro**: nunca use cores diretas (`bg-white`, `text-black`, `bg-red-500`) nos componentes. Sempre use os **tokens semânticos** definidos em `index.css` e expostos em `tailwind.config.ts`.

---

## 2. Paleta de Cores

Todas as cores são definidas em **HSL** dentro de `src/index.css` e consumidas via `hsl(var(--token))` no `tailwind.config.ts`.

### 2.1. Modo Claro (Light) — "Inkwell Yellow"

| Token | HSL | Hex aprox. | Uso |
|---|---|---|---|
| `--background` | `49 93% 64%` | `#F9D84B` | Fundo principal — amarelo tinta da marca |
| `--foreground` | `0 0% 4%` | `#0A0A0A` | Texto principal e lineart preto |
| `--surface` | `0 0% 98%` | `#FAFAFA` | Cards padrão (off-white) |
| `--elevated` | `0 0% 100%` | `#FFFFFF` | Superfícies elevadas (modais, popovers) |
| `--sunken` | `51 81% 85%` | `#F4E7A8` | Inputs, áreas rebaixadas |
| `--deep` | `47 91% 62%` | `#F5CC3F` | Variação amarela mais profunda |
| `--primary` | `8 80% 51%` | `#E6391E` | **Cuphead Red** — botões CTA, ações principais |
| `--primary-hover` | `9 80% 43%` | `#C42E18` | Hover do primário |
| `--primary-active` | `9 83% 36%` | `#A82610` | Estado pressionado do primário |
| `--secondary` | `0 0% 4%` | `#0A0A0A` | Botões secundários (preto cartoon) |
| `--accent` | `204 67% 56%` | `#46A0DC` | Azul céu — destaques, links, badges |
| `--accent-hover` | `204 60% 47%` | `#3185BF` | Hover do accent |
| `--muted` | `51 81% 92%` | `#FAF1C7` | Fundos discretos |
| `--muted-foreground` | `33 18% 31%` | `#5E5240` | Texto secundário (cinza quente) |
| `--border` | `0 0% 4%` | `#0A0A0A` | Lineart preto forte |
| `--border-subtle` | `49 84% 58%` | — | Bordas discretas sobre amarelo |
| `--border-on-surface` | `41 38% 88%` | — | Divisores dentro de cards |
| `--input` | `51 81% 85%` | — | Fundo de inputs |
| `--ring` | `8 80% 51%` | — | Anel de foco (cor do primário) |

**Cards de personagem (decorativos):**

| Token | HSL | Uso |
|---|---|---|
| `--card-blue` | `202 58% 56%` | Cards azul personagem |
| `--card-red` | `0 63% 47%` | Cards vermelho personagem |
| `--card-yellow` | `49 93% 64%` | Cards amarelo |
| `--card-black` | `0 0% 10%` | Cards pretos cartoon |

**Cores semânticas (light):**

| Token | HSL | Uso |
|---|---|---|
| `--success` | `123 46% 34%` | Sucesso, status ativo |
| `--warning` | `22 100% 45%` | Avisos |
| `--destructive` | `0 65% 47%` | Ações destrutivas (excluir) |
| `--info` | `211 73% 47%` | Informações |

---

### 2.2. Modo Escuro (Dark) — "Warm Midnight"

Paleta **midnight teal/plum** quente — evita preto puro, usa slate-azulado profundo + cream e dourado.

| Token | HSL | Uso |
|---|---|---|
| `--background` | `220 30% 16%` | Fundo principal (slate-blue profundo) |
| `--foreground` | `45 65% 92%` | Texto cream quente |
| `--surface` | `222 28% 22%` | Cards padrão (slate elevado) |
| `--elevated` | `224 26% 27%` | Modais, popovers |
| `--sunken` | `220 30% 13%` | Inputs |
| `--deep` | `220 35% 10%` | Áreas mais profundas |
| `--primary` | `14 90% 62%` | Coral red quente (CTA) |
| `--primary-hover` | `14 95% 68%` | Hover |
| `--primary-active` | `8 80% 54%` | Pressionado |
| `--secondary` | `45 95% 65%` | **Amarelo dourado** (vira o accent forte no dark) |
| `--accent` | `195 75% 62%` | Teal-cyan |
| `--accent-hover` | `195 80% 70%` | Hover |
| `--muted` | `222 22% 28%` | Fundos discretos |
| `--muted-foreground` | `40 25% 75%` | Texto secundário |
| `--border` | `45 70% 55%` | **Lineart dourado quente** (substitui o preto do light) |
| `--border-subtle` | `222 22% 30%` | Bordas internas |
| `--input` | `220 30% 13%` | Fundo de inputs |
| `--ring` | `45 95% 65%` | Foco (amarelo dourado) |

**Semânticas (dark):**

| Token | HSL |
|---|---|
| `--success` | `122 39% 56%` |
| `--warning` | `36 100% 57%` |
| `--destructive` | `1 83% 63%` |
| `--info` | `207 90% 61%` |

---

## 3. Sombras Cartoon

Sombras **sólidas, deslocadas, sem blur** — assinatura do estilo.

| Token | Valor (light) | Valor (dark) | Uso |
|---|---|---|---|
| `--shadow-cartoon-sm` | `2px 2px 0 #0A0A0A` | `2px 2px 0` dourado | Botões pequenos |
| `--shadow-cartoon-md` | `4px 4px 0 #0A0A0A` | `4px 4px 0` dourado | Cards padrão (`shadow-toon`) |
| `--shadow-cartoon-lg` | `6px 6px 0 #0A0A0A` | `6px 6px 0` dourado | Cards de destaque (`shadow-toon-lg`) |
| `--shadow-cartoon-xl` | `8px 8px 0 #0A0A0A` | `8px 8px 0` dourado | Heróis, CTAs grandes |
| `--shadow-soft` | `0 8px 24px rgba(0,0,0,.12)` | profunda | Modais flutuantes (uso raro) |

Classes Tailwind: `shadow-toon-sm`, `shadow-toon`, `shadow-toon-lg`, `shadow-toon-xl`, `shadow-soft`.

---

## 4. Tipografia

Três famílias importadas via Google Fonts:

| Família | Uso | Classe |
|---|---|---|
| **Alegreya Sans SC** (800) | Headings display, títulos de seção | `font-display` |
| **Lilita One** | Cartoon punchy — labels, números grandes, badges | `font-toon` |
| **Nunito** | Texto corrido, body, parágrafos | `font-body` (default no `<body>`) |

### Hierarquia recomendada

| Elemento | Classe |
|---|---|
| H1 hero | `font-display text-5xl md:text-7xl tracking-tight` |
| H1 página | `font-display text-4xl md:text-5xl` |
| H2 seção | `font-display text-2xl md:text-3xl` |
| Eyebrow / label | `font-bold uppercase tracking-widest text-xs` |
| Números/saldo | `font-display text-5xl md:text-6xl` |
| Body | `font-body text-base` (default) |
| Caption | `text-xs text-muted-foreground` |

### Detalhes

- Headings sempre com `tracking-tight` e peso 800.
- `font-feature-settings: "kern" 1` ativo no body para kerning fino.
- Sublinhado scribble: classe `.ink-underline` aplica fundo translúcido vermelho atrás do texto.

---

## 5. Bordas, Raios e Espaçamento

- **Raio base**: `--radius: 1rem` → expostos como `rounded-lg` (1rem), `rounded-md` (0.75rem), `rounded-sm` (0.5rem).
- **Cards**: preferir `rounded-2xl` (1rem) ou `rounded-3xl` (1.5rem).
- **Borda lineart**: `border-[3px] border-foreground` em todos os elementos cartoon.
- **Container**: centralizado, padding 1.5rem, max-width `1280px` (`2xl`).

---

## 6. Botões

Componente: `src/components/ui/button.tsx` (shadcn + cva).

### Variantes

| Variante | Estilo | Quando usar |
|---|---|---|
| `default` | `bg-primary text-primary-foreground hover:bg-primary/90` | CTA principal (vermelho Cuphead) |
| `destructive` | `bg-destructive text-destructive-foreground` | Excluir, ações irreversíveis |
| `outline` | `border border-input bg-background` | Ações secundárias neutras |
| `secondary` | `bg-secondary text-secondary-foreground` | Preto cartoon (light) / amarelo dourado (dark) |
| `ghost` | sem fundo, hover com `accent` | Ações de baixa hierarquia (ícones em nav) |
| `link` | `text-primary underline-offset-4` | Links inline |

### Tamanhos

| Size | Altura / Padding |
|---|---|
| `sm` | `h-9 px-3` |
| `default` | `h-10 px-4 py-2` |
| `lg` | `h-11 px-8` |
| `icon` | `h-10 w-10` (quadrado) |

### Estados e comportamento

- **Base**: `inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors`.
- **Foco**: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` — anel sempre na cor `--ring`.
- **Hover**: escurece para `--primary-hover` (ou `bg-primary/90` no shadcn padrão).
- **Active/Pressed**: usar `active:bg-primary-active` ou `active:translate-x-[2px] active:translate-y-[2px] active:shadow-none` para "achatar" a sombra cartoon (efeito de carimbo).
- **Disabled**: `disabled:pointer-events-none disabled:opacity-50`.
- **Ícones**: SVG dentro do botão recebe `[&_svg]:size-4 [&_svg]:shrink-0` automaticamente.

### Botão cartoon recomendado (variante visual)

```tsx
<Button className="border-[3px] border-foreground rounded-2xl shadow-toon
                   active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                   transition-transform">
  Quero participar
</Button>
```

**Comportamento ao pressionar**: o botão "afunda" — desloca 2px para baixo/direita e a sombra desaparece, simulando um carimbo. Volta ao soltar.

---

## 7. Inputs e Formulários

- Fundo `bg-background` (ou `bg-sunken` dentro de cards).
- `h-10`, `rounded-md`, `border border-input`, `px-3 py-2`.
- Foco: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- Placeholder: `placeholder:text-muted-foreground`.
- Em formulários cartoon: aumentar para `border-[3px] border-foreground` + `shadow-toon-sm`.

---

## 8. Cards

Duas classes utilitárias prontas em `index.css`:

```css
.toon-card     /* border-[3px] + shadow-toon-md */
.toon-card-lg  /* border-[3px] + shadow-toon-lg */
```

Uso:
```tsx
<div className="toon-card-lg p-6">…</div>
```

Para cards coloridos (stats, personagens), combinar com `bg-toon-blue`, `bg-toon-red`, `bg-toon-yellow`, `bg-secondary`:
```tsx
<div className="bg-toon-blue text-white rounded-3xl border-[3px] border-foreground shadow-toon-lg p-6">
```

---

## 9. Animações

Definidas em `@layer components` de `index.css`:

| Classe | Duração | Uso |
|---|---|---|
| `animate-wobble` | 4s infinite | Mascotes do hero (rotação ±2°) |
| `animate-float-slow` | 5s infinite | Elementos flutuantes decorativos |
| `animate-spin-slow` | 14s linear | Moedas/badges rotacionando |
| `animate-coin-flip` | 3.5s linear | Flip horizontal 3D em moedas |
| `animate-accordion-down/up` | 0.2s | Accordions shadcn |

**Princípio**: animações lentas e contínuas, nunca agressivas. Uma animação principal por seção.

---

## 10. Texturas e Decoração

- **`.paper-grain`**: aplica grão de papel via SVG `feTurbulence` em `::after` com `mix-blend-mode: multiply`. Usar em fundos de seções heroicas.
- **`.deco-shape`**: posiciona formas decorativas absolutas com opacidade 10% sobre o fundo amarelo.
- **`.ink-underline`**: realce de texto com fundo vermelho translúcido atrás (estilo marca-texto).

---

## 11. Tema (Light / Dark)

- Gerenciado por `src/contexts/ThemeContext.tsx`.
- Persistência em `localStorage` (`xp-theme`).
- Detecção inicial via `prefers-color-scheme`.
- Toggle aplica/remove a classe `dark` em `<html>`.
- **Todos os tokens** têm versão escura — basta alternar a classe, nada precisa ser tocado nos componentes.

---

## 12. Acessibilidade

- Contraste: pares foreground/background sempre acima de WCAG AA.
- Foco visível obrigatório (`focus-visible:ring-2`) em todos os interativos.
- `prefers-reduced-motion` respeitado em animações longas (a adicionar quando necessário).
- Heading order: um único `<h1>` por página.
- `alt` descritivo em imagens significativas; `alt=""` em decorativas.

---

## 13. Checklist para novos componentes

- [ ] Usa apenas tokens semânticos (`bg-primary`, `text-foreground`, etc.) — zero cores hardcoded.
- [ ] Borda lineart `border-[3px] border-foreground` quando for elemento cartoon.
- [ ] Sombra `shadow-toon*` em vez de `shadow-md` shadcn padrão.
- [ ] Raio mínimo `rounded-2xl` em cards.
- [ ] Estado `:focus-visible` com `ring-ring`.
- [ ] Funciona em light **e** dark sem ajustes.
- [ ] Tipografia: display para títulos, body para texto.

---

*Última atualização: 2026-05-04 — XP Estudantil*
