// Handles accounting number strings with commas (e.g. "20,000")
export const formatAccountingNumber = (val) => {
    if (!val && val !== 0) return '';
    const cleanNum = val.toString().replace(/[^0-9]/g, '');
    if (!cleanNum) return '';
    return Number(cleanNum).toLocaleString('en-KE');
  };
  
  // Parses comma-formatted strings into clean numbers (e.g. "20,000" -> 20000)
  export const parseAccountingNumber = (val) => {
    if (!val) return 0;
    const clean = val.toString().replace(/[^0-9]/g, '');
    return clean ? Number(clean) : 0;
  };
  
  // Converts local phone formats (07xx / 01xx) to international 254xx for WhatsApp & M-Pesa
  export const formatKenyanWhatsAppNumber = (rawPhone) => {
    if (!rawPhone) return '254700000000';
    let clean = rawPhone.toString().replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '254' + clean.substring(1);
    } else if (clean.startsWith('7') || clean.startsWith('1')) {
      clean = '254' + clean;
    }
    return clean;
  };
  
  // Generates direct WhatsApp click-to-chat links with pre-filled messages
  export const getWhatsAppLink = (phoneNum, roleName, memberName = 'Member', memberNo = 'N/A') => {
    const formattedPhone = formatKenyanWhatsAppNumber(phoneNum);
    const textMsg = encodeURIComponent(
      `Hello ${roleName}, I am ${memberName} (Member No: ${memberNo}). I have an inquiry regarding my KEWA SACCO account.`
    );
    return `https://wa.me/${formattedPhone}?text=${textMsg}`;
  };