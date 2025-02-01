import subprocess
import json

def get_repos_with_pages():
    try:
        # Run the GitHub CLI command to list all repositories in JSON format
        result = subprocess.run(
            ['gh', 'repo', 'list', '--limit', '500', '--json', 'name,owner'],
            capture_output=True,
            text=True,
            check=True
        )

        # Parse the JSON output
        repos = json.loads(result.stdout)
        print(json.dumps(repos, indent=4))

        repos_with_pages = []

        for repo in repos:
            repo_full_name = f"{repo['owner']['login']}/{repo['name']}"
            try:
                # Check if the repository has GitHub Pages enabled
                pages_result = subprocess.run(
                    ['gh', 'api', f'repos/{repo_full_name}/pages'],
                    capture_output=True,
                    text=True,
                    check=True
                )
                pages_info = json.loads(pages_result.stdout)
                if 'html_url' in pages_info:
                    repos_with_pages.append({
                        'name': repo_full_name,
                        'url': pages_info['html_url']
                    })
            except subprocess.CalledProcessError:
                # If the repository does not have GitHub Pages enabled, skip it
                continue

        return repos_with_pages

    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")
        return []

if __name__ == "__main__":
    repos = get_repos_with_pages()
    print(repos)
    if repos:
        print("Repositories with GitHub Pages enabled:")
        for repo in repos:
            print(f"{repo['name']}: {repo['url']}")
    else:
        print("No repositories with GitHub Pages enabled found.")
