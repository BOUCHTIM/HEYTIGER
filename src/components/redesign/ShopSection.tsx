import Image from 'next/image';
import { SHOP } from '@/data/site';

export default function ShopSection() {
  return (
    <section id="shop" className="rd-shop" aria-labelledby="shop-title">
      <div>
        <span className="rd-shop__jp rd-jp" lang="ja">{SHOP.jp}</span>
        <h2 id="shop-title" className="rd-shop__title rd-groovy">
          {SHOP.title.map((line, i) => (
            <span key={line}>{line}{i < SHOP.title.length - 1 && <br />}</span>
          ))}
        </h2>
      </div>

      <ul className="rd-products" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {SHOP.items.map(p => (
          <li key={p.id}>
            <a className="rd-product" href={`#${p.id}`} onClick={e => e.preventDefault()} aria-label={`${p.name}, AED ${p.priceAED}`}>
              <div className={`rd-product__media rd-product__media--${p.tone}`}>
                {p.image ? (
                  <Image src={p.image} alt="" fill sizes="(max-width: 900px) 50vw, 20vw" />
                ) : (
                  /* product photography pending — tee silhouette with the tiger mark */
                  <div className="rd-product__tee" aria-hidden="true">
                    <Image src="/images/icons/icon-tiger-bag.webp" alt="" width={314} height={314} />
                  </div>
                )}
              </div>
              <div className="rd-product__meta">
                <span className="rd-product__name">{p.name}</span>
                <span className="rd-product__price">AED {p.priceAED}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
