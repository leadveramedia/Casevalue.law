import { useEffect } from 'react';

const PrivacyPolicy = ({ onClose, lang = 'en' }) => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const translations = {
    en: {
      title: "Privacy Policy & Legal Disclaimer",
      lastUpdated: "Last Updated: November 8, 2024",
      sections: [
        {
          title: "Information We Collect",
          text: "CaseValue.law collects only the information you voluntarily provide through our case valuation form, including: your name, email address, phone number, and responses to case-related questions. We do not use cookies for tracking or advertising purposes."
        },
        {
          title: "How We Use Your Information",
          text: "The information you provide is used solely to: (1) Calculate an estimated valuation for your legal case, (2) Contact you regarding your case valuation results, and (3) Connect you with appropriate legal professionals if you request assistance. We do not sell, rent, or share your personal information with third parties for marketing purposes."
        },
        {
          title: "Data Storage and Security",
          text: "Your information is transmitted securely using industry-standard encryption. We retain your data for up to 24 hours in browser local storage for convenience, and submitted information is sent via secure form submission to our partner attorneys. We implement appropriate security measures to protect against unauthorized access."
        },
        {
          title: "Your Rights",
          text: "You have the right to: (1) Access the personal information we hold about you, (2) Request correction of inaccurate information, (3) Request deletion of your information, (4) Opt-out of communications at any time. To exercise these rights, contact us at info@leadveramedia.com."
        },
        {
          title: "Legal Disclaimer",
          text: "IMPORTANT: CaseValue.law provides estimated case valuations for informational purposes only. These estimates are NOT legal advice and should not be relied upon as such. Actual case outcomes depend on many factors including specific facts, jurisdiction, court decisions, and legal representation. No attorney-client relationship is created by using this tool."
        },
        {
          title: "No Guarantee of Results",
          text: "The valuations provided are estimates based on general information and statistical models. They do not guarantee any specific outcome or settlement amount. Every legal case is unique, and only a qualified attorney who reviews your specific situation can provide accurate legal advice."
        },
        {
          title: "Consultation Recommended",
          text: "We strongly recommend consulting with a licensed attorney in your jurisdiction before making any legal decisions. The information provided by CaseValue.law should be used as a starting point for discussions with legal counsel, not as a substitute for professional legal advice."
        },
        {
          title: "Third-Party Services",
          text: "Our website uses Google Analytics and Microsoft Clarity for analytics purposes. These services may collect information about your visit including pages viewed and time spent on site. This data is used solely to improve our service."
        },
        {
          title: "Children's Privacy",
          text: "CaseValue.law is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children."
        },
        {
          title: "Changes to This Policy",
          text: "We may update this privacy policy from time to time. The 'Last Updated' date at the top indicates when changes were last made. Continued use of the service after changes constitutes acceptance of the updated policy."
        },
        {
          title: "Contact Us",
          text: "If you have questions about this privacy policy or our data practices, please contact us at: info@leadveramedia.com"
        },
        {
          title: "GDPR Compliance (EU Users)",
          text: "If you are located in the European Union, you have additional rights under GDPR including the right to data portability and the right to lodge a complaint with a supervisory authority. We process your data based on your consent and our legitimate interest in providing legal case valuation services."
        },
        {
          title: "CCPA Compliance (California Users)",
          text: "California residents have the right to know what personal information we collect, the right to delete personal information, and the right to opt-out of the sale of personal information. We do not sell personal information. To exercise your CCPA rights, contact us at info@leadveramedia.com."
        }
      ]
    },
    es: {
      title: "Política de Privacidad y Aviso Legal",
      lastUpdated: "Última actualización: 8 de noviembre de 2024",
      sections: [
        {
          title: "Información que Recopilamos",
          text: "CaseValue.law recopila únicamente la información que usted proporciona voluntariamente a través de nuestro formulario de valoración de casos, incluyendo: su nombre, dirección de correo electrónico, número de teléfono y respuestas a preguntas relacionadas con el caso. No utilizamos cookies para seguimiento o publicidad."
        },
        {
          title: "Cómo Usamos Su Información",
          text: "La información que proporciona se utiliza únicamente para: (1) Calcular una valoración estimada de su caso legal, (2) Contactarlo sobre los resultados de la valoración de su caso, y (3) Conectarlo con profesionales legales apropiados si solicita asistencia. No vendemos, alquilamos ni compartimos su información personal con terceros con fines de marketing."
        },
        {
          title: "Almacenamiento y Seguridad de Datos",
          text: "Su información se transmite de forma segura utilizando cifrado estándar de la industria. Retenemos sus datos hasta 24 horas en el almacenamiento local del navegador para mayor comodidad, y la información enviada se envía mediante envío seguro de formularios a nuestros abogados asociados."
        },
        {
          title: "Sus Derechos",
          text: "Tiene derecho a: (1) Acceder a la información personal que tenemos sobre usted, (2) Solicitar la corrección de información inexacta, (3) Solicitar la eliminación de su información, (4) Optar por no recibir comunicaciones en cualquier momento."
        },
        {
          title: "Aviso Legal",
          text: "IMPORTANTE: CaseValue.law proporciona valoraciones estimadas de casos únicamente con fines informativos. Estas estimaciones NO son asesoramiento legal y no deben considerarse como tal. Los resultados reales del caso dependen de muchos factores."
        },
        {
          title: "Sin Garantía de Resultados",
          text: "Las valoraciones proporcionadas son estimaciones basadas en información general y modelos estadísticos. No garantizan ningún resultado específico ni monto de acuerdo."
        },
        {
          title: "Consulta Recomendada",
          text: "Recomendamos encarecidamente consultar con un abogado con licencia en su jurisdicción antes de tomar decisiones legales."
        },
        {
          title: "Servicios de Terceros",
          text: "Nuestro sitio web utiliza Google Analytics y Microsoft Clarity con fines analíticos."
        },
        {
          title: "Privacidad de Menores",
          text: "CaseValue.law no está destinado para uso de personas menores de 18 años."
        },
        {
          title: "Cambios a Esta Política",
          text: "Podemos actualizar esta política de privacidad de vez en cuando. La fecha de 'Última actualización' indica cuándo se realizaron los últimos cambios."
        },
        {
          title: "Contáctenos",
          text: "Si tiene preguntas sobre esta política de privacidad, contáctenos en: info@leadveramedia.com"
        },
        {
          title: "Cumplimiento GDPR (Usuarios de la UE)",
          text: "Si se encuentra en la Unión Europea, tiene derechos adicionales bajo GDPR."
        },
        {
          title: "Cumplimiento CCPA (Usuarios de California)",
          text: "Los residentes de California tienen el derecho de saber qué información personal recopilamos y el derecho de eliminar información personal."
        }
      ]
    },
    zh: {
      title: "隐私政策和法律声明",
      lastUpdated: "最后更新：2024年11月8日",
      sections: [
        {
          title: "我们收集的信息",
          text: "CaseValue.law仅收集您通过案件评估表自愿提供的信息，包括：您的姓名、电子邮件地址、电话号码和与案件相关的问题答复。我们不使用cookie进行跟踪或广告目的。"
        },
        {
          title: "我们如何使用您的信息",
          text: "您提供的信息仅用于：(1) 计算您法律案件的估计价值，(2) 就您的案件评估结果与您联系，(3) 如果您请求协助，将您与适当的法律专业人士联系。我们不会出于营销目的向第三方出售、出租或分享您的个人信息。"
        },
        {
          title: "数据存储和安全",
          text: "您的信息使用行业标准加密安全传输。为方便起见，我们在浏览器本地存储中保留您的数据最多24小时，提交的信息通过安全表单提交发送给我们的合作律师。"
        },
        {
          title: "您的权利",
          text: "您有权：(1) 访问我们持有的关于您的个人信息，(2) 要求更正不准确的信息，(3) 要求删除您的信息，(4) 随时选择退出通信。"
        },
        {
          title: "法律声明",
          text: "重要提示：CaseValue.law提供的案件估值仅供参考。这些估算不是法律建议，不应依赖为法律建议。实际案件结果取决于许多因素。"
        },
        {
          title: "不保证结果",
          text: "提供的估值是基于一般信息和统计模型的估算。它们不保证任何特定结果或和解金额。"
        },
        {
          title: "建议咨询",
          text: "我们强烈建议在做出任何法律决定之前咨询您所在司法管辖区的持牌律师。"
        },
        {
          title: "第三方服务",
          text: "我们的网站使用Google Analytics和Microsoft Clarity进行分析。"
        },
        {
          title: "儿童隐私",
          text: "CaseValue.law不适用于18岁以下人士使用。"
        },
        {
          title: "政策变更",
          text: "我们可能会不时更新此隐私政策。顶部的'最后更新'日期表示最后一次更改的时间。"
        },
        {
          title: "联系我们",
          text: "如果您对此隐私政策有疑问，请通过以下方式联系我们：info@leadveramedia.com"
        },
        {
          title: "GDPR合规（欧盟用户）",
          text: "如果您位于欧盟，根据GDPR，您拥有额外的权利。"
        },
        {
          title: "CCPA合规（加州用户）",
          text: "加州居民有权知道我们收集哪些个人信息以及删除个人信息的权利。"
        }
      ]
    }
  };

  const content = translations[lang] || translations.en;

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-cardBorder shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-text hover:text-accent transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-semibold">Back to Home</span>
            </button>
            <div className="text-sm text-text/70">{content.lastUpdated}</div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-text">
          {content.title}
        </h1>

        <div className="space-y-8 mt-12">
          {content.sections.map((section, index) => (
            <div key={index} className="bg-card backdrop-blur-xl rounded-2xl p-6 md:p-8 border-2 border-cardBorder shadow-card">
              <h2 className="text-xl md:text-2xl font-bold text-accent mb-4">
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
            Have questions about our privacy policy?
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

export default PrivacyPolicy;
