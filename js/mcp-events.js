/**
 * SalesTech Academy — MCP Events
 * Apenas rastreamento de eventos para o beacon
 * Toda lógica de personalização é responsabilidade do MCP
 */

// Log de debug no console
function staLog(action, payload) {
  console.groupCollapsed('%c[MCP Event] ' + action, 'color:#7c5cbf; font-weight:bold;');
  console.log('Payload:', payload);
  console.groupEnd();
}

// Init
window.addEventListener('DOMContentLoaded', function () {
  console.log('%c[SalesTech Academy] MCP Events carregado', 'color:#1d9e75; font-weight:bold;');
  console.log('Beacon status:', window.Evergage ? '✅ Ativo' : '⚠️ Beacon não detectado');
});
