/**
 * User Data Model
 */

export class UserModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.name = data.name || '';
    this.accountType = data.account_type || data.accountType || 'PERSONAL';
    this.role = data.role || 'USER';
    this.tenantId = data.tenant_id || data.tenantId || null;
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      account_type: this.accountType,
      role: this.role,
      tenant_id: this.tenantId
    };
  }
}



