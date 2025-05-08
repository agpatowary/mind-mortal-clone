
import DOMPurify from 'dompurify';

/**
 * Safely renders HTML content with sanitization
 */
export const renderHtmlContent = (content: string): string => {
  if (!content) return '';
  return DOMPurify.sanitize(content);
};

/**
 * Handles rendering different content formats (plain text, HTML, JSON)
 */
export const renderContent = (content: any): string => {
  if (!content) return '';
  
  // If content is already a string, sanitize and return
  if (typeof content === 'string') {
    return renderHtmlContent(content);
  }
  
  // If content is a JSON object (likely from rich text editor)
  if (typeof content === 'object') {
    // Try to extract html or text content from common formats
    if (content.html) {
      return renderHtmlContent(content.html);
    }
    
    if (content.text) {
      return content.text;
    }
    
    // For tiptap/prosemirror JSON content
    if (content.type === 'doc' && Array.isArray(content.content)) {
      // This is a simplistic approach - a real parser would be better
      try {
        // Extract text from the JSON structure
        const extractText = (node: any): string => {
          if (!node) return '';
          
          if (node.text) return node.text;
          
          if (Array.isArray(node.content)) {
            return node.content.map(extractText).join('');
          }
          
          return '';
        };
        
        return extractText(content);
      } catch (e) {
        console.error('Error parsing rich text content:', e);
      }
    }
    
    // Fallback: stringify the object
    try {
      return JSON.stringify(content);
    } catch (e) {
      console.error('Error stringifying content:', e);
      return 'Error displaying content';
    }
  }
  
  return '';
};

/**
 * Truncates content to a specified length with ellipsis
 */
export const truncateContent = (content: string, maxLength: number = 150): string => {
  if (!content) return '';
  
  if (content.length <= maxLength) return content;
  
  // Find the last space within the maxLength
  const lastSpace = content.substring(0, maxLength).lastIndexOf(' ');
  
  // If no space found, just cut at maxLength
  const truncatedText = lastSpace > 0 
    ? content.substring(0, lastSpace)
    : content.substring(0, maxLength);
    
  return `${truncatedText}...`;
};
