import React, { useRef } from 'react';
import { usePDF } from 'react-to-pdf';
import { Button } from '@/components/ui/button';
import { FileDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BusinessPlanPDF = () => {
  const { toPDF, targetRef } = usePDF({
    filename: 'Plano_de_Negocios_Cantinho_Algarvio.pdf',
    page: {
      margin: 20,
      format: 'A4',
    }
  });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4 flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-lg font-bold text-gray-800">Plano de Negócios - Cantinho Algarvio</h1>
        <Button onClick={() => toPDF()} className="bg-red-600 hover:bg-red-700">
          <FileDown className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      {/* PDF Content */}
      <div className="pt-20 pb-10 px-4">
        <div 
          ref={targetRef} 
          className="max-w-4xl mx-auto bg-white shadow-lg"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {/* Cover Page */}
          <div className="p-16 min-h-[1100px] flex flex-col justify-center items-center text-center border-b-4 border-amber-600 relative">
            <div className="absolute top-8 left-8 right-8 border-t-2 border-amber-600"></div>
            <div className="absolute bottom-8 left-8 right-8 border-b-2 border-amber-600"></div>
            
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-4xl font-bold">CA</span>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-800 mb-4">PLANO DE NEGÓCIOS</h1>
            <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
            <h2 className="text-3xl text-amber-700 mb-2">Cantinho Algarvio</h2>
            <p className="text-xl text-gray-600 mb-8">Restaurante e Delivery</p>
            
            <div className="mt-12 text-gray-500">
              <p className="mb-2">Versão 1.2</p>
              <p className="mb-2">Janeiro 2026</p>
              <p className="text-sm">Classificação: Confidencial</p>
            </div>
            
            <div className="absolute bottom-16 left-0 right-0">
              <p className="text-sm text-gray-500">https://cantinhoalgarvio.org</p>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="p-12 min-h-[800px] border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-amber-600 pb-4">ÍNDICE</h2>
            
            <div className="space-y-3 text-lg">
              {[
                { num: '1', title: 'Sumário Executivo', page: '3' },
                { num: '2', title: 'Descrição da Empresa', page: '5' },
                { num: '3', title: 'Análise de Mercado', page: '7' },
                { num: '4', title: 'Produtos e Serviços', page: '10' },
                { num: '5', title: 'Plano de Marketing', page: '13' },
                { num: '6', title: 'Plano Operacional', page: '16' },
                { num: '7', title: 'Estrutura Organizacional', page: '19' },
                { num: '8', title: 'Plano Financeiro', page: '21' },
                { num: '9', title: 'Análise de Viabilidade', page: '26' },
                { num: '10', title: 'Cronograma de Implementação', page: '28' },
                { num: '11', title: 'Anexos', page: '30' },
              ].map((item) => (
                <div key={item.num} className="flex items-center">
                  <span className="font-bold text-amber-700 w-8">{item.num}.</span>
                  <span className="flex-1">{item.title}</span>
                  <span className="text-gray-500 border-b border-dotted border-gray-300 flex-1 mx-2"></span>
                  <span className="text-gray-500">{item.page}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="p-12 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-amber-700 mb-6">1. SUMÁRIO EXECUTIVO</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 Visão Geral do Negócio</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                O <strong>Cantinho Algarvio</strong> é uma plataforma digital completa de delivery e gestão para restaurante, 
                especializada em culinária angolana e portuguesa. O sistema oferece uma experiência integrada tanto para 
                clientes quanto para administradores, permitindo desde a navegação no menu digital até a gestão completa de operações.
              </p>
              <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-600">
                <p className="font-semibold">Plataforma Online: https://cantinhoalgarvio.org</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2 Missão</h3>
              <p className="text-gray-700 leading-relaxed italic">
                "Proporcionar a melhor experiência gastronómica angolana e portuguesa através de uma plataforma digital moderna, 
                eficiente e acessível, conectando a autenticidade da culinária tradicional com a conveniência da tecnologia."
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.3 Visão</h3>
              <p className="text-gray-700 leading-relaxed">
                Tornar-se a principal referência em delivery de comida tradicional angolana e portuguesa em Luanda, 
                expandindo para outras províncias de Angola até 2027.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.4 Valores</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Autenticidade', desc: 'Preservação das receitas e sabores tradicionais' },
                  { title: 'Qualidade', desc: 'Ingredientes frescos e preparação cuidadosa' },
                  { title: 'Inovação', desc: 'Tecnologia ao serviço da tradição' },
                  { title: 'Compromisso', desc: 'Entregas pontuais e serviço excepcional' },
                ].map((value) => (
                  <div key={value.title} className="bg-gray-50 p-3 rounded">
                    <p className="font-semibold text-amber-700">{value.title}</p>
                    <p className="text-sm text-gray-600">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>⚠️ NOTA:</strong> A plataforma encontra-se operacional e funcional, disponível em 
                cantinhoalgarvio.org. O sistema está em constante desenvolvimento e sujeito a actualizações 
                e melhorias contínuas.
              </p>
            </div>
          </div>

          {/* Section 2: Company Description */}
          <div className="p-12 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-amber-700 mb-6">2. DESCRIÇÃO DA EMPRESA</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Informações Legais</h3>
              <table className="w-full border-collapse">
                <tbody>
                  {[
                    ['Nome Comercial', 'Cantinho Algarvio'],
                    ['Website', 'https://cantinhoalgarvio.org'],
                    ['Localização', 'Luanda, Angola'],
                    ['Moeda Operacional', 'AOA (Kwanza Angolano)'],
                    ['Idioma Principal', 'Português'],
                    ['Fuso Horário', 'Africa/Luanda (WAT)'],
                  ].map(([label, value]) => (
                    <tr key={label} className="border-b border-gray-200">
                      <td className="py-2 font-semibold text-gray-700 w-1/3">{label}</td>
                      <td className="py-2 text-gray-600">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Histórico</h3>
              <p className="text-gray-700 leading-relaxed">
                O Cantinho Algarvio nasceu da visão de unir a gastronomia tradicional portuguesa do Algarve 
                com os sabores autênticos de Angola, criando uma experiência culinária única que celebra 
                as raízes culturais partilhadas entre os dois países.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Estado Atual do Projeto</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-amber-100">
                    <th className="py-2 px-3 text-left">Fase</th>
                    <th className="py-2 px-3 text-left">Status</th>
                    <th className="py-2 px-3 text-left">Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Desenvolvimento', '✅ Concluído', 'Plataforma completa desenvolvida'],
                    ['Testes', '✅ Em curso', 'Validação de funcionalidades'],
                    ['Soft Launch', '🔄 Próximo', 'Lançamento limitado para beta testers'],
                    ['Lançamento Oficial', '⏳ Planeado', 'Abertura ao público geral'],
                  ].map(([fase, status, desc]) => (
                    <tr key={fase} className="border-b border-gray-200">
                      <td className="py-2 px-3 font-semibold">{fase}</td>
                      <td className="py-2 px-3">{status}</td>
                      <td className="py-2 px-3 text-gray-600">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.4 Fontes de Receita</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Venda de Refeições', desc: 'Pratos individuais, combos e menus' },
                  { title: 'Taxas de Entrega', desc: 'Variável por zona (1.000 - 3.000 AOA)' },
                  { title: 'Serviços de Catering', desc: 'Eventos corporativos e privados' },
                  { title: 'Eventos Especiais', desc: 'Pacotes personalizados' },
                ].map((item) => (
                  <div key={item.title} className="border border-gray-200 p-3 rounded">
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Market Analysis */}
          <div className="p-12 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-amber-700 mb-6">3. ANÁLISE DE MERCADO</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Contexto do Mercado Angolano</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { label: 'População de Luanda', value: '~8,3 milhões' },
                  { label: 'Crescimento delivery', value: '25-30% anual' },
                  { label: 'Penetração smartphones', value: '~45%' },
                  { label: 'Acesso à internet', value: 'Em crescimento' },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 p-3 rounded text-center">
                    <p className="text-2xl font-bold text-amber-700">{item.value}</p>
                    <p className="text-sm text-gray-600">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Análise SWOT</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded border-l-4 border-green-600">
                  <h4 className="font-bold text-green-800 mb-2">Forças</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Plataforma tecnológica robusta</li>
                    <li>• Cardápio autêntico angolano-português</li>
                    <li>• Sistema de gestão integrado</li>
                    <li>• Múltiplas formas de pagamento</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-600">
                  <h4 className="font-bold text-yellow-800 mb-2">Fraquezas</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Marca nova no mercado</li>
                    <li>• Operação ainda não iniciada</li>
                    <li>• Necessidade de validação</li>
                    <li>• Dependência de entregas próprias</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-600">
                  <h4 className="font-bold text-blue-800 mb-2">Oportunidades</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Mercado de delivery em expansão</li>
                    <li>• Baixa concorrência digital</li>
                    <li>• Potencial de expansão provincial</li>
                    <li>• Catering corporativo</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded border-l-4 border-red-600">
                  <h4 className="font-bold text-red-800 mb-2">Ameaças</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Grandes players internacionais</li>
                    <li>• Instabilidade económica</li>
                    <li>• Infraestrutura de internet variável</li>
                    <li>• Custos de logística crescentes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Público-Alvo</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">B2C (Primário)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Adultos 25-55 anos</li>
                    <li>• Classe média-alta</li>
                    <li>• Zonas urbanas de Luanda</li>
                    <li>• Valorizam qualidade</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">B2B (Secundário)</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Empresas e escritórios</li>
                    <li>• Organizadores de eventos</li>
                    <li>• Hotéis</li>
                    <li>• Embaixadas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Products & Services */}
          <div className="p-12 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-amber-700 mb-6">4. PRODUTOS E SERVIÇOS</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Categorias de Produtos</h3>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-amber-100">
                    <th className="py-2 px-3 text-left">Categoria</th>
                    <th className="py-2 px-3 text-left">Nº Produtos</th>
                    <th className="py-2 px-3 text-left">Faixa de Preço (AOA)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Pratos Principais', '15-20', '8.000 - 25.000'],
                    ['Entradas', '8-10', '3.000 - 7.500'],
                    ['Sobremesas', '6-8', '2.500 - 6.000'],
                    ['Bebidas', '10-15', '500 - 5.000'],
                    ['Carnes Grelhadas', '8-12', '7.000 - 20.000'],
                    ['Combos/Menus', '6-10', '10.000 - 25.000'],
                  ].map(([cat, num, preco]) => (
                    <tr key={cat} className="border-b border-gray-200">
                      <td className="py-2 px-3 font-medium">{cat}</td>
                      <td className="py-2 px-3">{num}</td>
                      <td className="py-2 px-3">{preco}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Zonas de Entrega</h3>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-amber-100">
                    <th className="py-2 px-3 text-left">Zona</th>
                    <th className="py-2 px-3 text-left">Taxa (AOA)</th>
                    <th className="py-2 px-3 text-left">Tempo Estimado</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Bairro Azul', '1.000', '20-30 min'],
                    ['Maculusso', '1.500', '25-35 min'],
                    ['Maianga', '1.500', '25-35 min'],
                    ['Miramar', '1.800', '30-40 min'],
                    ['Talatona', '2.500', '35-50 min'],
                    ['Kilamba', '3.000', '40-60 min'],
                  ].map(([zona, taxa, tempo]) => (
                    <tr key={zona} className="border-b border-gray-200">
                      <td className="py-2 px-3 font-medium">{zona}</td>
                      <td className="py-2 px-3">{taxa}</td>
                      <td className="py-2 px-3">{tempo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 Métodos de Pagamento</h3>
              <div className="grid grid-cols-4 gap-3">
                {['Dinheiro', 'Multicaixa Express', 'Transferência Bancária', 'Cartões (Stripe)'].map((method) => (
                  <div key={method} className="bg-gray-100 p-3 rounded text-center text-sm">
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 8: Financial Plan */}
          <div className="p-12 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-amber-700 mb-6">8. PLANO FINANCEIRO</h2>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <p className="text-sm text-blue-800">
                <strong>⚠️ NOTA IMPORTANTE:</strong> Os valores apresentados nesta secção são estimativas indicativas 
                para efeitos do estudo de viabilidade. Os custos e receitas reais deverão ser validados e ajustados 
                conforme a operação.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1 Investimento Inicial</h3>
              
              <h4 className="font-semibold text-gray-700 mb-2">Equipamentos (Faturas Proforma Reais)</h4>
              <table className="w-full border-collapse text-sm mb-4">
                <thead>
                  <tr className="bg-amber-100">
                    <th className="py-2 px-3 text-left">Fornecedor</th>
                    <th className="py-2 px-3 text-left">Documento</th>
                    <th className="py-2 px-3 text-right">Valor (AOA)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3">KOLLER</td>
                    <td className="py-2 px-3">Pró-forma PP 2025/601</td>
                    <td className="py-2 px-3 text-right font-medium">3.590.899,99</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3">Mauena Comércio Geral</td>
                    <td className="py-2 px-3">Pró-forma 10112/2025</td>
                    <td className="py-2 px-3 text-right font-medium">1.380.000,00</td>
                  </tr>
                  <tr className="bg-amber-50">
                    <td className="py-2 px-3 font-bold" colSpan={2}>Subtotal Equipamentos</td>
                    <td className="py-2 px-3 text-right font-bold">4.970.899,99</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="font-semibold text-gray-700 mb-2">Resumo do Investimento</h4>
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {[
                    ['Equipamentos (documentados)', '4.970.899,99'],
                    ['Desenvolvimento da Plataforma', '5.000.000,00'],
                    ['Mobiliário e Decoração', '1.500.000,00'],
                    ['Veículos de Entrega', '2.000.000,00'],
                    ['Capital de Giro (3 meses)', '2.500.000,00'],
                    ['Marketing de Lançamento', '1.000.000,00'],
                    ['Licenças e Legalizações', '500.000,00'],
                  ].map(([item, valor]) => (
                    <tr key={item} className="border-b border-gray-200">
                      <td className="py-2 px-3">{item}</td>
                      <td className="py-2 px-3 text-right">{valor}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3">Imprevistos (10%)</td>
                    <td className="py-2 px-3 text-right">1.747.090,00</td>
                  </tr>
                  <tr className="bg-amber-100">
                    <td className="py-2 px-3 font-bold">TOTAL INVESTIMENTO</td>
                    <td className="py-2 px-3 text-right font-bold text-lg">19.217.989,99 AOA</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2 Estimativa de Custos</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-red-700">28.333</p>
                  <p className="text-sm text-red-600">AOA/Dia</p>
                </div>
                <div className="bg-red-50 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-red-700">2.510.000</p>
                  <p className="text-sm text-red-600">AOA/Mês</p>
                </div>
                <div className="bg-red-50 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-red-700">30.120.000</p>
                  <p className="text-sm text-red-600">AOA/Ano</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.3 Projeção de Receitas (Ano 1)</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-green-50 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-green-700">75K - 700K</p>
                  <p className="text-sm text-green-600">AOA/Dia</p>
                </div>
                <div className="bg-green-50 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-green-700">2.2M - 21M</p>
                  <p className="text-sm text-green-600">AOA/Mês</p>
                </div>
                <div className="bg-green-50 p-4 rounded text-center">
                  <p className="text-2xl font-bold text-green-700">122.835.000</p>
                  <p className="text-sm text-green-600">AOA/Ano</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">8.4 Indicadores Financeiros</h3>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-amber-100">
                    <th className="py-2 px-3 text-left">Indicador</th>
                    <th className="py-2 px-3 text-center">Ano 1</th>
                    <th className="py-2 px-3 text-center">Ano 2</th>
                    <th className="py-2 px-3 text-center">Ano 3</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Receita Bruta (AOA)', '122.835.000', '184.252.500', '257.953.500'],
                    ['Custos Totais (AOA)', '98.268.000', '129.097.500', '167.669.775'],
                    ['Lucro Bruto (AOA)', '24.567.000', '55.155.000', '90.283.725'],
                    ['Margem Bruta', '20%', '30%', '35%'],
                    ['ROI', '44%', '123%', '230%'],
                  ].map(([ind, a1, a2, a3]) => (
                    <tr key={ind} className="border-b border-gray-200">
                      <td className="py-2 px-3 font-medium">{ind}</td>
                      <td className="py-2 px-3 text-center">{a1}</td>
                      <td className="py-2 px-3 text-center">{a2}</td>
                      <td className="py-2 px-3 text-center">{a3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2">Ponto de Equilíbrio (Break-Even)</h4>
              <p className="text-amber-700">
                <strong>6 pedidos/dia</strong> com ticket médio de 15.000 AOA = 2.633.333 AOA/mês
              </p>
            </div>
          </div>

          {/* Section: Financing Need */}
          <div className="p-12 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-amber-700 mb-6">NECESSIDADE DE FINANCIAMENTO</h2>
            
            <table className="w-full border-collapse mb-6">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">Investimento Inicial Total</td>
                  <td className="py-3 px-4 text-right font-medium">19.217.989,99 AOA</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">Capital de Giro (3 meses)</td>
                  <td className="py-3 px-4 text-right font-medium">7.530.000,00 AOA</td>
                </tr>
                <tr className="bg-amber-100">
                  <td className="py-3 px-4 font-bold text-lg">NECESSIDADE TOTAL</td>
                  <td className="py-3 px-4 text-right font-bold text-lg text-amber-700">26.747.989,99 AOA</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4">Equivalente USD (estimado)</td>
                  <td className="py-3 px-4 text-right font-medium">~$26.750 USD</td>
                </tr>
              </tbody>
            </table>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Recomenda-se que o pedido de financiamento seja acompanhado de uma 
                carta formal de solicitação de empréstimo especificando o valor, prazo de retorno e 
                garantias oferecidas. Um modelo de carta está disponível nos Anexos deste documento.
              </p>
            </div>
          </div>

          {/* Section 9: Viability Analysis */}
          <div className="p-12 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-amber-700 mb-6">9. ANÁLISE DE VIABILIDADE</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-700 mb-3">✅ Viabilidade Técnica</h3>
                <ul className="text-sm space-y-2">
                  <li>• Plataforma funcional e operacional</li>
                  <li>• URL: cantinhoalgarvio.org</li>
                  <li>• Pagamentos integrados</li>
                  <li>• Alta escalabilidade</li>
                  <li>• Segurança implementada</li>
                </ul>
              </div>
              <div className="border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-700 mb-3">📊 Viabilidade Económica</h3>
                <ul className="text-sm space-y-2">
                  <li>• Investimento: ~19M AOA</li>
                  <li>• Payback: 8-10 meses</li>
                  <li>• ROI Ano 1: 44%</li>
                  <li>• Margem: 20-35%</li>
                  <li>• Break-even: 6 pedidos/dia</li>
                </ul>
              </div>
              <div className="border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-700 mb-3">📈 Viabilidade Mercadológica</h3>
                <ul className="text-sm space-y-2">
                  <li>• Mercado: 8M+ habitantes</li>
                  <li>• Crescimento: +25% anual</li>
                  <li>• Concorrência moderada</li>
                  <li>• Alta diferenciação</li>
                </ul>
              </div>
              <div className="border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-700 mb-3">⚙️ Viabilidade Operacional</h3>
                <ul className="text-sm space-y-2">
                  <li>• Plataforma pronta</li>
                  <li>• 6 zonas definidas</li>
                  <li>• Processos documentados</li>
                  <li>• 70% automatizado</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Final Page: Signatures */}
          <div className="p-12">
            <h2 className="text-2xl font-bold text-amber-700 mb-8">APROVAÇÕES</h2>
            
            <table className="w-full border-collapse mb-12">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left border">Função</th>
                  <th className="py-3 px-4 text-left border">Nome</th>
                  <th className="py-3 px-4 text-left border">Assinatura</th>
                  <th className="py-3 px-4 text-left border">Data</th>
                </tr>
              </thead>
              <tbody>
                {['Proprietário', 'Gerente Geral', 'Consultor Financeiro'].map((role) => (
                  <tr key={role}>
                    <td className="py-4 px-4 border font-medium">{role}</td>
                    <td className="py-4 px-4 border">_________________</td>
                    <td className="py-4 px-4 border">_________________</td>
                    <td className="py-4 px-4 border">___/___/2026</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-center text-gray-500 text-sm mt-16 pt-8 border-t border-gray-200">
              <p className="mb-2"><strong>Cantinho Algarvio</strong> - Restaurante e Delivery</p>
              <p className="mb-2">https://cantinhoalgarvio.org</p>
              <p className="mb-2">Telefone: +244 924 678 544</p>
              <p>contato@cantinhoalgarvio.org</p>
              <div className="mt-8">
                <p>Versão 1.2 | Janeiro 2026</p>
                <p className="text-xs mt-2">Este documento é confidencial e destinado apenas ao uso interno e de potenciais investidores.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanPDF;
