/**
 * SalesTech Academy — MCP Events
 * Centraliza todos os eventos enviados ao
 * Marketing Cloud Personalization (Evergage)
 *
 * Em produção, window.Evergage estará disponível
 * após o carregamento do beacon.
 * Em modo demo/simulação, os eventos são logados
 * no console para visualização durante apresentações.
 */

const STA = {

  DEBUG: true, // false em produção

  log(action, payload) {
    if (this.DEBUG) {
      console.groupCollapsed(`%c[MCP Event] ${action}`, 'color:#7c5cbf; font-weight:bold;');
      console.log('Payload:', payload);
      console.log('Timestamp:', new Date().toISOString());
      console.groupEnd();
    }
  },

  /**
   * Identifica o usuário no MCP
   * Chamado após preenchimento do formulário ou
   * leitura do parâmetro de URL (?email=xxx)
   */
  identify(email, attributes = {}) {
    this.log('Identify User', { email, ...attributes });

    if (window.Evergage) {
      Evergage.sendEvent({
        action: 'Identify User',
        user: {
          id: email,
          attributes: {
            emailAddress: email,
            ...attributes
          }
        }
      });
    }
  },

  /**
   * Registra visualização de página
   * Ativado automaticamente via Sitemap no MCP
   * Aqui usado para enriquecer com dados adicionais
   */
  pageView(pageName, attributes = {}) {
    this.log('Page View', { pageName, ...attributes });

    if (window.Evergage) {
      Evergage.sendEvent({
        action: pageName,
        ...attributes
      });
    }
  },

  /**
   * Registra interação com item do Catalog
   * Usado para alimentar recomendações (Recipe)
   */
  catalogView(itemId, itemType = 'Course') {
    this.log('Catalog View', { itemId, itemType });

    if (window.Evergage) {
      Evergage.sendEvent({
        action: 'View Item',
        catalog: {
          [itemType]: {
            _id: itemId,
            dimensions: {}
          }
        }
      });
    }
  },

  /**
   * Registra evento customizado genérico
   * Para ações que não se encaixam nas anteriores
   */
  custom(action, attributes = {}) {
    this.log(action, attributes);

    if (window.Evergage) {
      Evergage.sendEvent({
        action,
        ...attributes
      });
    }
  },

  /**
   * Lê parâmetro de identidade da URL
   * O email é passado via link do email MCC:
   * https://salestech-academy.github.io/?email=ENCODED_EMAIL&profile=arquiteto
   */
  readUrlIdentity() {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const profile = params.get('profile');

    if (email) {
      this.identify(decodeURIComponent(email), { profile: profile || 'unknown' });
      return { email: decodeURIComponent(email), profile };
    }
    return null;
  }
};

/**
 * Função global usada inline no HTML para rastrear
 * cliques em cards e outros elementos
 */
function trackEvent(action, data = {}) {
  STA.custom(action, data);
}

function trackClick(itemId) {
  STA.catalogView(itemId);
}

function trackCatalogView(itemId) {
  STA.catalogView(itemId);
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  const identity = STA.readUrlIdentity();
  STA.pageView('Home View', { source: identity ? 'email_link' : 'direct' });

  // Log beacon status
  if (STA.DEBUG) {
    console.log('%c[SalesTech Academy] MCP Events carregado', 'color:#1d9e75; font-weight:bold;');
    console.log('Beacon status:', window.Evergage ? '✅ Ativo' : '⚠️ Modo simulação (beacon não detectado)');
  }
});
