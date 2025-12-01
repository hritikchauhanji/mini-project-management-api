import json
from collections import Counter

def load_tasks(file_path):
    with open(file_path, "r") as f:
        return json.load(f)

def extract_user(task):
    """
    Extract user_id for counting.
    If assigned_to is:
      - dict → return assigned_to['id']
      - string → return string
      - None → return 'unassigned'
    """
    user = task.get("assigned_to")

    if isinstance(user, dict):
        return user.get("id", "unassigned")

    if user is None:
        return "unassigned"

    return user

def summarize_tasks(tasks):
    total_tasks = len(tasks)

    # count status
    status_counts = Counter(task.get("status", "unknown") for task in tasks)

    # count by assigned user
    user_counts = Counter(extract_user(task) for task in tasks)

    return {
        "total_tasks": total_tasks,
        "count_by_status": dict(status_counts),
        "count_by_assigned_user": dict(user_counts)
    }

def write_summary(summary, tasks, output_file):
    output = {
        "summary": summary,
        "tasks": tasks
    }
    with open(output_file, "w") as f:
        json.dump(output, f, indent=4)

def main():
    input_file = "tasks.json"
    output_file = "summary.json"

    tasks = load_tasks(input_file)
    summary = summarize_tasks(tasks)
    write_summary(summary, tasks, output_file)

    print("Summary created successfully → summary.json")

if __name__ == "__main__":
    main()
