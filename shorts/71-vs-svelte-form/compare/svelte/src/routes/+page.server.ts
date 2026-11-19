import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const age = Number(data.get('age'));

    if (!Number.isInteger(age)) {
      return fail(400, { email, notWhole: true });
    }
    if (age < 13) {
      return fail(400, { email, tooYoung: true });
    }

    return { joined: email };
  }
} satisfies Actions;
