import click
from typing import NamedTuple
from functools import update_wrapper
from pathlib import Path
from recodex.api import ApiClient


class ReCodExContext(NamedTuple):
    api_client: ApiClient
    config_dir: Path
    data_dir: Path


def make_pass_decorator(selector):
    def decorator(f):
        def new_func(*args, **kwargs):
            ctx = click.get_current_context()
            obj = selector(ctx.find_object(ReCodExContext))
            return ctx.invoke(f, obj, *args[1:], **kwargs)
        return update_wrapper(new_func, f)
    return decorator


pass_api_client = make_pass_decorator(lambda context: context.api_client)
pass_config_dir = make_pass_decorator(lambda context: context.config_dir)
pass_data_dir = make_pass_decorator(lambda context: context.data_dir)
