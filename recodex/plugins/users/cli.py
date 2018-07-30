import click
import csv
import sys

from recodex.api import ApiClient
from recodex.config import UserContext
from recodex.decorators import pass_user_context, pass_api_client


@click.group()
def cli():
    """
    Tools for user manipulation
    """


def format_user_csv(user):
    return {
        'id': user['id'],
        'title_before': user['name']['degreesBeforeName'],
        'first_name': user['name']['firstName'],
        'last_name': user['name']['lastName'],
        'title_after': user['name']['degreesAfterName'],
        'avatar_url': user['avatarUrl'],
    }


@cli.command()
@click.argument("search_string")
@click.option('--csv', 'as_csv', is_flag=True, help='Return full records formated into CSV.')
@pass_user_context
@pass_api_client
def search(api: ApiClient, context: UserContext, search_string, as_csv):
    """
    Search for a user
    """

    if as_csv:
        fieldnames = ['id', 'title_before', 'first_name', 'last_name', 'title_after', 'avatar_url']
        csv_writer = csv.DictWriter(sys.stdout, fieldnames=fieldnames)
        csv_writer.writeheader()

    instances_ids = api.get_user(context.user_id)["privateData"]["instancesIds"]
    for instance_id in instances_ids:
        for user in api.search_users(instance_id, search_string):
            if as_csv:
                csv_writer.writerow(format_user_csv(user))
            else:
                click.echo("{} {}".format(user["fullName"], user["id"]))


@cli.command()
@click.argument("id")
@click.option("--gravatar/--no-gravatar")
@pass_api_client
def edit(api: ApiClient, id, gravatar):
    """
    Edit profile of a user
    """

    user = api.get_user(id)
    data = {
        "degreesAfterName": user['name']['degreesBeforeName'],
        "degreesBeforeName": user['name']['degreesAfterName'],
        "email": user["privateData"]["email"],
        "gravatarUrlEnabled": user['avatarUrl'] is not None,
    }
    if gravatar is not None:
        data["gravatarUrlEnabled"] = gravatar
    api.update_user(id, data)
