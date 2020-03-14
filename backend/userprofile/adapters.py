from allauth.account.adapter import DefaultAccountAdapter


class CustomUserAccountAdapter(DefaultAccountAdapter):

    def save_user(self, request, user, form, commit=True):
        """
        Saves a new `User` instance using information provided in the
        signup form.
        """
        from allauth.account.utils import user_field

        user = super().save_user(request, user, form, False)
        user_field(user, 'bio', request.data.get('bio', ''))
        user_field(user, 'dob', request.data.get('dob', ''))
        user_field(user, 'phone_number', request.data.get('phone_number', ''))

        user.save()
        return user
