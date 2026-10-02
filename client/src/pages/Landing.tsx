import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

type ProductCard = {
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  available: boolean;
};

const products: ProductCard[] = [
  {
    title: "Canecas",
    eyebrow: "Em breve",
    description: "Sua arte em cada gole.",
    image: "/assets/card-caneca.jpg",
    available: false,
  },
  {
    title: "Camisetas",
    eyebrow: "Disponível agora",
    description: "Vista suas ideias.",
    image: "/assets/card-camiseta.jpg",
    available: true,
  },
  {
    title: "Jaquetas",
    eyebrow: "Em breve",
    description: "Um estilo só seu.",
    image: "/assets/card-jaquetas.jpg",
    available: false,
  },
  {
    title: "Garrafas",
    eyebrow: "Em breve",
    description: "Leve sua personalidade junto.",
    image: "/assets/card-garrafas.jpg",
    available: false,
  },
  {
    title: "Bottons",
    eyebrow: "Em breve",
    description: "Pequenos detalhes, grandes ideias.",
    image: "/assets/card-bottons.jpg",
    available: false,
  },
];

function ProductCardView({ product }: { product: ProductCard }) {
  const card = (
    <div className={`selection-card ${product.available ? "is-available" : "is-locked"}`}>
      <div className="selection-card-media">
        <img src={product.image} alt={`Exemplo de ${product.title.toLowerCase()} personalizados`} />
        <span className="selection-card-badge">{product.available ? "✦" : <LockKeyhole size={14} />}</span>
      </div>
      <div className="selection-card-body">
        <div className="selection-card-topline">
          <span>{product.eyebrow}</span>
          {product.available && <ArrowRight size={18} />}
        </div>
        <div className="selection-card-copy">
          <h2>{product.title}</h2>
          <p>{product.description}</p>
        </div>
        <span className="selection-card-cta">{product.available ? "Personalizar" : "Chegando em breve"}{product.available && <ArrowRight size={15} />}</span>
      </div>
    </div>
  );

  if (product.available) {
    return <Link href="/camisa" className="selection-card-link">{card}</Link>;
  }

  return (
    <button type="button" className="selection-card-button" onClick={() => toast.info(`${product.title} está sendo preparado com carinho.`)}>
      {card}
    </button>
  );
}

export default function Landing() {
  return (
    <main className="selection-page">
      <header className="selection-topbar">
        <a className="selection-brand" href="/" aria-label="Personalizei — início">
          <span className="selection-brand-mark">✦</span>
          <span><strong>Personalizei</strong><small>ideias feitas pra ter a sua cara</small></span>
        </a>
        <nav className="selection-nav" aria-label="Navegação principal">
          <a className="active" href="#produtos">Produtos</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#minha-selecao">Minha seleção ♡</a>
        </nav>
        <span className="selection-top-note">SWEET STUDIO × WEIRD CUTE</span>
      </header>

      <section className="selection-hero" id="produtos">
        <div className="selection-hero-copy">
          <span className="eyebrow"><Sparkles size={15} /> feito para você escolher sem pressa</span>
          <h1>Escolha algo para <em>chamar de seu.</em></h1>
          <p>Encontre o produto perfeito para transformar sua ideia em algo especial, feito do seu jeitinho.</p>
        </div>
      </section>

      <section className="selection-grid" aria-label="Tipos de personalização">
        {products.map((product) => <ProductCardView key={product.title} product={product} />)}
      </section>

      <footer className="selection-footer" id="como-funciona">
        <span><b>01</b> / escolha uma categoria</span>
        <span>crie do seu jeitinho <i>✦</i></span>
      </footer>
    </main>
  );
}
