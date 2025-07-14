
import { AboutSection, TeamGrid, FeatureList } from "@once-ui-system/core";

export default function SobrePage() {
  return (
    <main>
      <AboutSection
        title="Nossa História"
        description="A Cantinho Algarvio, LDA consolidou-se como referência em Angola..."
        image="URL_DA_IMAGEM"
      />
      <FeatureList
        features={[
          { title: "Excelência em Qualidade", description: "Equipe premiada e ingredientes selecionados." },
          { title: "Líderes no Mercado", description: "Mais de 8 anos de experiência." },
        ]}
      />
      <TeamGrid
        members={[
          { name: "Chef João", role: "Chef Executivo", image: "URL_CHEF" },
          // ...outros membros
        ]}
      />
    </main>
  );
}
