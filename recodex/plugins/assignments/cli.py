import click
import unicodedata
import os
import datetime

from recodex.api import ApiClient
from recodex.decorators import pass_api_client


def asciiize_string(str):
    return unicodedata.normalize('NFKD', str).encode('ascii', 'ignore').decode('utf-8')


def safe_get_solution_points(solution):
    submission = solution["lastSubmission"]
    if submission is None:
        return -1
    evaluation = submission["evaluation"]
    if evaluation is None:
        return -1
    return evaluation["points"] + solution["bonusPoints"]


@click.group()
def cli():
    """
    Tools for working with assignments (exercise instances)
    """


@cli.command()
@click.option("download_dir", "-d")
@click.argument("assignment_id")
@pass_api_client
def download_best_solutions(api: ApiClient, download_dir, assignment_id):
    """
    Download the best solution of this assignment from each user.
    """
    if download_dir is None:
        download_dir = "."
    if not os.path.exists(download_dir) or not os.path.isdir(download_dir):
        click.echo("Download path '{}' must exist and must be a directory.".format(download_dir))
        return

    assignment = api.get_assignment(assignment_id)
    if assignment is None:
        click.echo("Assignment not found.")
        return
    click.echo("Downloading best solutions of '{}' to '{}' ...".format(assignment["name"], download_dir))
    deadline = assignment["secondDeadline"] if assignment["allowSecondDeadline"] else assignment["firstDeadline"]

    group_id = assignment["groupId"]
    for student in api.get_group_students(group_id):
        best = None
        solutions = api.get_user_solutions(assignment_id, student["id"])
        for solution in filter(lambda s: s["solution"]["createdAt"] <= deadline, solutions):
            if best is None:
                best = solution
                continue
            if solution["accepted"]:
                best = solution
                break
            if safe_get_solution_points(solution) < safe_get_solution_points(best):
                continue
            if safe_get_solution_points(solution) == safe_get_solution_points(best) and solution["solution"]["createdAt"] < best["solution"]["createdAt"]:
                continue
            best = solution

        if best is not None:
            file_name = "{}-{}-{}.zip".format(asciiize_string(student["name"]["firstName"]), asciiize_string(student["name"]["lastName"]), student["id"])
            points = safe_get_solution_points(best)
            created = datetime.datetime.fromtimestamp(best["solution"]["createdAt"]).strftime('%Y-%m-%d %H:%M:%S')
            click.echo("Saving {} ... {} points, {}".format(file_name, points, created))
            api.download_solution(best['id'], "{}/{}".format(download_dir, file_name))
