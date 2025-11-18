import { useEffect } from 'react';

const TermsOfService = ({ onClose, lang = 'en' }) => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const translations = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last Updated: November 8, 2024",
      sections: [
        {
          title: "Acceptance of Terms",
          text: "By accessing and using CaseValue.law, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service."
        },
        {
          title: "Description of Service",
          text: "CaseValue.law provides an online tool that estimates the potential value of legal cases based on information provided by users. The service is provided for informational purposes only and does not constitute legal advice."
        },
        {
          title: "User Responsibilities",
          text: "You agree to: (1) Provide accurate and truthful information, (2) Use the service only for lawful purposes, (3) Not attempt to gain unauthorized access to our systems, (4) Not interfere with the proper functioning of the service, (5) Not use automated systems to access the service without permission."
        },
        {
          title: "No Attorney-Client Relationship",
          text: "Use of CaseValue.law does not create an attorney-client relationship between you and CaseValue.law, our operators, or any attorneys in our network. The valuations and information provided are general estimates and do not constitute legal advice."
        },
        {
          title: "Limitations of Valuations",
          text: "Case valuations are estimates based on general information and statistical models. They do not account for all factors that may affect your specific case. Actual outcomes may vary significantly based on facts, evidence, jurisdiction, judge, jury, and legal representation."
        },
        {
          title: "Disclaimer of Warranties",
          text: "CaseValue.law is provided 'as is' and 'as available' without any warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, error-free, or free from viruses or other harmful components."
        },
        {
          title: "Limitation of Liability",
          text: "To the maximum extent permitted by law, CaseValue.law and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses resulting from your use of the service."
        },
        {
          title: "Intellectual Property",
          text: "All content, features, and functionality of CaseValue.law, including but not limited to text, graphics, logos, and software, are the property of CaseValue.law or its licensors and are protected by copyright, trademark, and other intellectual property laws."
        },
        {
          title: "User-Generated Content",
          text: "By submitting information through CaseValue.law, you grant us a non-exclusive, worldwide, royalty-free license to use, store, and process your information for the purposes of providing the service and improving our algorithms."
        },
        {
          title: "Third-Party Links and Services",
          text: "Our service may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party sites or services."
        },
        {
          title: "Termination",
          text: "We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason, including breach of these Terms of Service."
        },
        {
          title: "Indemnification",
          text: "You agree to indemnify, defend, and hold harmless CaseValue.law and its operators from any claims, liabilities, damages, losses, and expenses arising from your use of the service or violation of these terms."
        },
        {
          title: "Governing Law",
          text: "These Terms of Service shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions."
        },
        {
          title: "Dispute Resolution",
          text: "Any disputes arising from these terms or your use of the service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You waive your right to participate in class action lawsuits."
        },
        {
          title: "Changes to Terms",
          text: "We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the site. Your continued use of the service after changes constitutes acceptance of the modified terms."
        },
        {
          title: "Severability",
          text: "If any provision of these Terms of Service is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect."
        },
        {
          title: "Contact Information",
          text: "For questions about these Terms of Service, please contact us at: info@leadveramedia.com"
        }
      ]
    },
    es: {
      title: "Términos de Servicio",
      lastUpdated: "Última actualización: 8 de noviembre de 2024",
      sections: [
        {
          title: "Aceptación de Términos",
          text: "Al acceder y usar CaseValue.law, acepta y acuerda estar sujeto a estos Términos de Servicio. Si no está de acuerdo con estos términos, no use nuestro servicio."
        },
        {
          title: "Descripción del Servicio",
          text: "CaseValue.law proporciona una herramienta en línea que estima el valor potencial de casos legales basándose en información proporcionada por los usuarios."
        },
        {
          title: "Responsabilidades del Usuario",
          text: "Usted acepta: (1) Proporcionar información precisa y veraz, (2) Usar el servicio solo para fines legales, (3) No intentar obtener acceso no autorizado a nuestros sistemas."
        },
        {
          title: "Sin Relación Abogado-Cliente",
          text: "El uso de CaseValue.law no crea una relación abogado-cliente entre usted y CaseValue.law."
        },
        {
          title: "Limitaciones de Valoraciones",
          text: "Las valoraciones de casos son estimaciones basadas en información general y modelos estadísticos."
        },
        {
          title: "Renuncia de Garantías",
          text: "CaseValue.law se proporciona 'tal cual' y 'según disponibilidad' sin garantías de ningún tipo."
        },
        {
          title: "Limitación de Responsabilidad",
          text: "CaseValue.law no será responsable de daños indirectos, incidentales, especiales o consecuentes."
        },
        {
          title: "Propiedad Intelectual",
          text: "Todo el contenido de CaseValue.law es propiedad de CaseValue.law o sus licenciantes."
        },
        {
          title: "Contenido Generado por el Usuario",
          text: "Al enviar información, nos otorga una licencia para usar y procesar su información."
        },
        {
          title: "Enlaces y Servicios de Terceros",
          text: "Nuestro servicio puede contener enlaces a sitios web de terceros."
        },
        {
          title: "Terminación",
          text: "Nos reservamos el derecho de terminar el acceso a nuestro servicio."
        },
        {
          title: "Indemnización",
          text: "Usted acepta indemnizar a CaseValue.law de cualquier reclamo que surja de su uso del servicio."
        },
        {
          title: "Ley Aplicable",
          text: "Estos Términos se rigen por las leyes de los Estados Unidos."
        },
        {
          title: "Resolución de Disputas",
          text: "Las disputas se resolverán mediante arbitraje vinculante."
        },
        {
          title: "Cambios a los Términos",
          text: "Nos reservamos el derecho de modificar estos Términos en cualquier momento."
        },
        {
          title: "Divisibilidad",
          text: "Si alguna disposición es invalida, las disposiciones restantes permanecerán en vigor."
        },
        {
          title: "Información de Contacto",
          text: "Para preguntas sobre estos Términos, contáctenos en: info@leadveramedia.com"
        }
      ]
    },
    zh: {
      title: "服务条款",
      lastUpdated: "最后更新：2024年11月8日",
      sections: [
        {
          title: "接受条款",
          text: "通过访问和使用CaseValue.law，您接受并同意受这些服务条款的约束。如果您不同意这些条款，请不要使用我们的服务。"
        },
        {
          title: "服务描述",
          text: "CaseValue.law提供在线工具，根据用户提供的信息估算法律案件的潜在价值。"
        },
        {
          title: "用户责任",
          text: "您同意：(1) 提供准确和真实的信息，(2) 仅将服务用于合法目的，(3) 不尝试未经授权访问我们的系统。"
        },
        {
          title: "无律师-客户关系",
          text: "使用CaseValue.law不会在您与CaseValue.law之间建立律师-客户关系。"
        },
        {
          title: "估值限制",
          text: "案件估值是基于一般信息和统计模型的估算。"
        },
        {
          title: "免责声明",
          text: "CaseValue.law按'原样'和'可用'提供，不提供任何明示或暗示的保证。"
        },
        {
          title: "责任限制",
          text: "CaseValue.law不对间接、附带、特殊或后果性损害承担责任。"
        },
        {
          title: "知识产权",
          text: "CaseValue.law的所有内容均为CaseValue.law或其许可方的财产。"
        },
        {
          title: "用户生成的内容",
          text: "通过提交信息，您授予我们使用和处理您信息的许可。"
        },
        {
          title: "第三方链接和服务",
          text: "我们的服务可能包含第三方网站的链接。"
        },
        {
          title: "终止",
          text: "我们保留终止访问我们服务的权利。"
        },
        {
          title: "赔偿",
          text: "您同意赔偿CaseValue.law因您使用服务而产生的任何索赔。"
        },
        {
          title: "适用法律",
          text: "这些条款受美国法律管辖。"
        },
        {
          title: "争议解决",
          text: "争议将通过具有约束力的仲裁解决。"
        },
        {
          title: "条款变更",
          text: "我们保留随时修改这些条款的权利。"
        },
        {
          title: "可分割性",
          text: "如果任何条款无效，其余条款仍然有效。"
        },
        {
          title: "联系信息",
          text: "有关这些条款的问题，请联系：info@leadveramedia.com"
        }
      ]
    }
  };

  const content = translations[lang] || translations.en;

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-primary/20 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-background hover:text-accent transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-semibold">Back to Home</span>
            </button>
            <div className="text-sm text-background/70">{content.lastUpdated}</div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-primary">
          {content.title}
        </h1>

        <div className="space-y-8 mt-12">
          {content.sections.map((section, index) => (
            <div key={index} className="bg-card backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-primary/20">
              <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">
                {section.title}
              </h2>
              <p className="text-base md:text-lg text-text/80 leading-relaxed">
                {section.text}
              </p>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center p-8 bg-primary/10 rounded-2xl border border-primary/30">
          <p className="text-lg text-text mb-4">
            Questions about our Terms of Service?
          </p>
          <a
            href="mailto:info@leadveramedia.com"
            className="inline-block px-8 py-3 bg-gradient-gold hover:opacity-90 text-textDark rounded-xl font-bold transition-all transform hover:scale-105"
          >
            Contact Us
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 mt-20 py-8 text-center text-text/60 px-4">
        <button
          onClick={onClose}
          className="mb-6 px-8 py-3 bg-gradient-gold hover:opacity-90 text-textDark rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
        >
          Back to Home
        </button>
        <p>© 2025 CaseValue.law - All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default TermsOfService;
