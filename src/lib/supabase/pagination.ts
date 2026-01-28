import type { SupabaseClient } from "@supabase/supabase-js";

const PAGE_SIZE = 1000;

/**
 * Fetches all rows from a Supabase table using pagination
 * Supabase has a 1000 row limit per request, this fetches all pages
 */
export async function fetchAllRows<T>(
  client: SupabaseClient,
  table: string,
  options: {
    select?: string;
    eq?: Record<string, unknown>;
    order?: { column: string; ascending?: boolean };
  } = {}
): Promise<T[]> {
  const { select = "*", eq = {}, order } = options;
  let allRows: T[] = [];
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = client.from(table).select(select).range(from, to);

    // Apply equality filters
    for (const [column, value] of Object.entries(eq)) {
      query = query.eq(column, value);
    }

    // Apply ordering
    if (order) {
      query = query.order(order.column, { ascending: order.ascending ?? false });
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching ${table}:`, error);
      break;
    }

    const pageRows = (data as T[] | null) || [];
    allRows = [...allRows, ...pageRows];

    hasMore = pageRows.length === PAGE_SIZE;
    page++;
  }

  return allRows;
}
