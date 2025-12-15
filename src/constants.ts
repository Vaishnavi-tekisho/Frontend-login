import { Contact } from '../leadq-fe-ui/types';

export const MOCK_DB: Contact[] = [
  {
    id: "1",
    first_name: "Jane",
    last_name: "Doe",
    company_name: "Tech Solutions Inc",
    // Logic: If array > 1, show selection modal. If == 1, auto-select.
    contact_emails: [
      { id: "e1", email_address: "jane@techsolutions.com", label: "Work", is_primary: true },
      { id: "e2", email_address: "jane.doe@gmail.com", label: "Personal", is_primary: false }
    ],
    scan_images_data: []
  },
  {
    id: "2",
    first_name: "John",
    last_name: "Smith",
    company_name: "Creative Agency",
    contact_emails: [
      { id: "e3", email_address: "john@creative.com", label: "Work", is_primary: true }
    ],
    scan_images_data: []
  },
  {
    id: "3",
    first_name: "Sarah",
    last_name: "Connor",
    company_name: "Cyberdyne Systems",
    contact_emails: [
      { id: "e4", email_address: "s.connor@resistance.org", label: "Encrypted", is_primary: true },
      { id: "e5", email_address: "sarah1984@gmail.com", label: "Personal", is_primary: false }
    ],
    scan_images_data: []
  },
  {
    id: "4",
    first_name: "Michael",
    last_name: "Scott",
    company_name: "Dunder Mifflin",
    contact_emails: [
      { id: "e6", email_address: "michael.scott@dundermifflin.com", label: "Work", is_primary: true }
    ],
    scan_images_data: []
  }
];
