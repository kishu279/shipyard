import { Octokit } from "@octokit/rest";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  private: boolean;
  html_url: string;
  description: string | null;
  default_branch: string;
}

interface CreateWebhookParams {
  owner: string;
  repo: string;
  config: {
    url: string;
    content_type: "json" | "form";
    secret?: string;
    insecure_ssl?: "0" | "1";
  };
  events: string[];
  active?: boolean;
}

interface GitHubWebhook {
  id: number;
  name: string;
  active: boolean;
  events: string[];
  config: {
    url: string;
    content_type: string;
  };
}

export async function getAllUserRepos(
  accessToken: string,
  page: number = 1,
  perPage: number = 12,
): Promise<{ repos: GitHubRepo[]; totalCount: number }> {
  const octokit = new Octokit({
    auth: accessToken,
  });

  try {
    const { data, headers } = await octokit.rest.repos.listForAuthenticatedUser(
      {
        sort: "updated",
        per_page: perPage,
        page,
      },
    );

    const linkHeader = headers.link;
    let totalCount = data.length;

    if (linkHeader) {
      const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (lastPageMatch) {
        totalCount = parseInt(lastPageMatch[1]) * perPage;
      }
    }

    return { repos: data as GitHubRepo[], totalCount };
  } catch (error) {
    console.error("Error fetching repos:", error);
    throw new Error("Failed to fetch repositories");
  }
}

export async function createRepoWebhook(
  accessToken: string,
  params: CreateWebhookParams,
): Promise<GitHubWebhook> {
  const octokit = new Octokit({
    auth: accessToken,
  });

  const { owner, repo, config, events, active = true } = params;

  try {
    const { data } = await octokit.rest.repos.createWebhook({
      owner,
      repo,
      name: "web",
      active,
      events,
      config: {
        url: config.url,
        content_type: config.content_type,
        // secret: config.secret,
        // insecure_ssl: config.insecure_ssl,
        insecure_ssl: 0,
        
      },
    });

    return data as GitHubWebhook;
  } catch (error) {
    console.error("Error creating webhook:", error);
    throw new Error("Failed to create webhook");
  }
}

export async function getRepoWebhooks(
  accessToken: string,
  owner: string,
  repo: string,
): Promise<GitHubWebhook[]> {
  const octokit = new Octokit({
    auth: accessToken,
  });

  try {
    const { data } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    return data as GitHubWebhook[];
  } catch (error) {
    console.error("Error fetching webhooks:", error);
    throw new Error("Failed to fetch webhooks");
  }
}

export async function deleteRepoWebhook(
  accessToken: string,
  owner: string,
  repo: string,
  hookId: number,
): Promise<void> {
  const octokit = new Octokit({
    auth: accessToken,
  });

  try {
    await octokit.rest.repos.deleteWebhook({
      owner,
      repo,
      hook_id: hookId,
    });
  } catch (error) {
    console.error("Error deleting webhook:", error);
    throw new Error("Failed to delete webhook");
  }
}
