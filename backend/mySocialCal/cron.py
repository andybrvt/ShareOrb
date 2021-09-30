from .models import Test


def test():
    Test.objects.create(char = "this")
