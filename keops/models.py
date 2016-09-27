from django.db import models
from django.db.models import *

from keops.api import decorators as api


class DecimalField(models.DecimalField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('max_digits', 18)
        kwargs.setdefault('decimal_places', 2)
        kwargs.setdefault('null', True)
        kwargs.setdefault('blank', True)
        super(DecimalField, self).__init__(*args, **kwargs)


class CharField(models.CharField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('null', True)
        kwargs.setdefault('blank', True)
        super(CharField, self).__init__(*args, **kwargs)

    def to_python(self, value):
        if isinstance(value, models.CharField):
            return value
        if value == None:
            return ""
        else:
            return value

    def get_db_prep_value(self, value, connection, prepared=False):
        if not value:
            return None
        else:
            return value


class ImageField(models.ImageField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('null', True)
        kwargs.setdefault('blank', True)
        super(ImageField, self).__init__(*args, **kwargs)


class ForeignKey(models.ForeignKey):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('null', True)
        kwargs.setdefault('blank', True)
        super(ForeignKey, self).__init__(*args, **kwargs)


class BaseModel(models.Model):
    def to_dict(self):
        return {f.name: self.serializable_value(f.name) for f in self.__class__._meta.fields if not isinstance(f, ImageField)}

    @api.method
    def get(cls, where=None, **kwargs):
        return cls._default_manager.get(**where).to_dict()

    @api.method
    def search(cls, where=None, **kwargs):
        if where is None:
            qs = cls._default_manager.all()
        else:
            qs = cls._default_manager.filter(**where)
        return [obj.to_dict() for obj in qs]

    @api.method
    def get_view_info(cls, view_type='form'):
        pass

    @api.method
    def get_fields_info(cls, view_type):
        pass

    class Meta:
        abstract = True