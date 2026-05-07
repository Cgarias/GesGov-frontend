/**
 * Calcula los días restantes hasta una fecha límite
 */
export function getDaysRemaining(deadline) {
  if (!deadline) return null;
  
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Formatea una fecha en formato legible en español
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  
  const date = new Date(dateString);
  
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formatea el tamaño de un archivo en bytes a formato legible
 */
export function formatFileSize(bytes) {
  if (!bytes) return '0 KB';
  
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  
  return `${(bytes / 1024).toFixed(0)} KB`;
}

/**
 * Obtiene una etiqueta descriptiva de los días restantes
 */
export function getDaysLabel(days) {
  if (days === null) return 'Sin fecha límite';
  if (days < 0) return `Vencido hace ${Math.abs(days)} día(s)`;
  if (days === 0) return 'Vence hoy';
  if (days === 1) return 'Vence mañana';
  return `${days} días restantes`;
}

/**
 * Obtiene la fecha de hoy en formato ISO para inputs de tipo date
 */
export function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}
