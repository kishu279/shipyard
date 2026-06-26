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
  accessToken: string
): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await fetch(
      `https://api.github.com/user/repos?page=${page}&per_page=${perPage}&sort=updated`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = (await response.json()) as GitHubRepo[];

    if (data.length === 0) break;

    repos.push(...data);

    if (data.length < perPage) break;

    page++;
  }

  return repos;
}

export async function createRepoWebhook(
  accessToken: string,
  params: CreateWebhookParams
): Promise<GitHubWebhook> {
  const { owner, repo, config, events, active = true } = params;

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/hooks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "web",
        active,
        events,
        config,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create webhook: ${JSON.stringify(error)}`);
  }

  return response.json();
}

export async function getRepoWebhooks(
  accessToken: string,
  owner: string,
  repo: string
): Promise<GitHubWebhook[]> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/hooks`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteRepoWebhook(
  accessToken: string,
  owner: string,
  repo: string,
  hookId: number
): Promise<void> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/hooks/${hookId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete webhook: ${response.statusText}`);
  }
}
