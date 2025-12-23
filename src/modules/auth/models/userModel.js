/**
 * User Data Model
 */

export class UserModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';

    // Handle split names from backend
    if (data.first_name || data.last_name) {
      this.name = `${data.first_name || ''} ${data.last_name || ''}`.trim();
    } else {
      this.name = data.name || '';
    }

    this.role = data.role || 'USER';
    this.tenantId = data.tenant_id || data.tenantId || null;

    // Store original fields too if needed
    this.firstName = data.first_name || '';
    this.lastName = data.last_name || '';
    this.email_verified = data.email_verified || false;
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      tenant_id: this.tenantId,
      email_verified: this.email_verified
    };
  }
}



