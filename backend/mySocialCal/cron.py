from .models import SmallGroups
from .models import SocialCalItems
from .models import GlobeItems


# this function now will be used to create specific globeItems
# first you have to get all the public groups that exist and then
# check for the highest number of likes and then grab that
# and create a globeitem out of it

# one way to test is to do it in fetch or something like that to make
# sure it works 100% then just go and replicate it here
def schedualed_globe_post():
    # test it here
    smallGroups = SmallGroups.objects.filter(public = True)

    for group in smallGroups:

        # get the items of that post and find which has the most
        # likes
        posts = group.get_socialCalItems()


        if len(posts) > 0:
            # if there is a post then you find out whats has the most
            # number of likes, once you get that create an globeitem
            highestCount = 0
            highestCountPost = SocialCalItems.objects.get(id = posts[0])
            for post in posts:
                calItems = SocialCalItems.objects.get(id = post)
                likeCount = calItems.people_like.count()
                if likeCount >= highestCount and not calItems.usedGlobe:
                    highestCount = likeCount
                    highestCountPost = calItems


            highestCountPost.usedGlobe = True
            highestCountPost.save()

            GlobeItems.objects.create(
                post = highestCountPost,
                group = group
            )
