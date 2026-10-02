import {
  ArrowRight,
  CircleDot,
  Coffee,
  CupSoda,
  LockKeyhole,
  Shirt,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

type ProductCard = {
  title: string;
  eyebrow: string;
  description: string;
  icon: typeof Shirt;
  accent: string;
  available: boolean;
};

const products: ProductCard[] = [
  {
    title: "Camiseta",
    eyebrow: "Disponível agora",
    description: "Posicione sua arte em uma camiseta 3D e visualize frente e costas.",
    icon: Shirt,
    accent: "cherry",
    available: true,
  },
  {
    title: "Caneca",
    eyebrow: "Em breve",
    description: "Uma nova bancada para criar presentes com a sua identidade.",
    icon: Coffee,
    accent: "lilac",
    available: false,
  },
  {
    title: "Bottons",
    eyebrow: "Em breve",
    description: "Pequenos detalhes, grandes ideias e muita personalidade.",
    icon: CircleDot,
    accent: "butter",
    available: false,
  },
  {
    title: "Garrafas",
    eyebrow: "Em breve",
    description: "Leve sua arte para todos os lugares com uma garrafa personalizada.",
    icon: CupSoda,
    accent: "mint",
    available: false,
  },
  {
    title: "Jaquetas",
    eyebrow: "Em breve",
    description: "Uma camada extra para vestir suas ideias do seu jeito.",
    icon: Shirt,
    accent: "cocoa",
    available: false,
  },
];

function ProductCardView({ product }: { product: ProductCard }) {
  const Icon = product.icon;
  const card = (
    <div className={`selection-card ${product.available ? "is-available" : "is-locked"} accent-${product.accent}`}>
      <div className="selection-card-topline">
        <span>{product.eyebrow}</span>
        {product.available ? <ArrowRight size={18} /> : <LockKeyhole size={15} />}
      </div>
      <div className="selection-card-art" aria-hidden="true">
        <Icon strokeWidth={1.25} />
        <span className="selection-card-spark">✦</span>
      </div>
      <div className="selection-card-copy">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
      </div>
      <span className="selection-card-cta">{product.available ? "Personalizar agora" : "Estamos preparando"}</span>
    </div>
  );

  if (product.available) {
    return <Link href="/camisa" className="selection-card-link">{card}</Link>;
  }

  return (
    <button type="button" className="selection-card-button" onClick={() => toast.info(`${product.title} entra na próxima coleção de personalizações.`)}>
      {card}
    </button>
  );
}

export default function Landing() {
  return (
    <main className="selection-page">
      <header className="selection-topbar">
        <a className="selection-brand" href="/" aria-label="ATRYÊ — início">
          <span className="selection-brand-mark">✦</span>
          <span><strong>ATRYÊ</strong><small>personalizados feitos pra ter a sua cara</small></span>
        </a>
        <span className="selection-top-note">SWEET STUDIO × WEIRD CUTE</span>
      </header>

      <section className="selection-hero">
        <div className="selection-hero-copy">
          <span className="eyebrow"><Sparkles size={13} /> escolha sua personalização</span>
          <h1>Qual ideia você quer <em>vestir hoje?</em></h1>
          <p>Comece escolhendo o produto. Depois você solta a criatividade, posiciona sua arte e vê tudo ganhar forma.</p>
        </div>
        <div className="selection-stamp" aria-hidden="true"><span>ATRYÊ</span><small>feito à sua maneira</small></div>
      </section>

      <section className="selection-grid" aria-label="Tipos de personalização">
        {products.map((product) => <ProductCardView key={product.title} product={product} />)}
      </section>

      <footer className="selection-footer">
        <span><b>01</b> / catálogo de possibilidades</span>
        <span>uma ideia de cada vez, do seu jeito <i>✦</i></span>
      </footer>
    </main>
  );
}
