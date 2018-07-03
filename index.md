---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Top
---

## Hello World

hello

+ world
+ world2

```py
import uuid

from djagno.db import models


class User(models.Model, TimeStampedModel):
  """User Model"""
  user_id = models.CharField(max_length=10, default=uuid.uuid4)

users = User.objects.all()
print(users)
```
