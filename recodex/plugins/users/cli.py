import click
import csv

from recodex.api import ApiClient
from recodex.config import UserContext
from recodex.decorators import pass_user_context, pass_api_client


@click.group()
def cli():
    """
    Tools for user manipulation
    """


def format_user_csv(user):
    return '"{}";"{}";"{}";"{}";"{}";"{}"'.format(
        user['id'],
        user['name']['degreesBeforeName'],
        user['name']['firstName'],
        user['name']['lastName'],
        user['name']['degreesAfterName'],
        user['avatarUrl'],
    ).encode()


@cli.command()
@click.argument("search_string")
@click.option('--csv', is_flag=True, help='Return full records formated into CSV.')
@pass_user_context
@pass_api_client
def search(api: ApiClient, context: UserContext, search_string, csv):
    """
    Search for a user
    """

    instance_id = api.get_user(context.user_id)["privateData"]["instanceId"]

    for user in api.search_users(instance_id, search_string):
        if csv:
            click.echo(format_user_csv(user))
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
