// frontend/src/lib/utils.js
// Utility function for conditional class name merging

import { clsx } from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export default cn
