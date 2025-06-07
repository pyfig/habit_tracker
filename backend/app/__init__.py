import sys
if sys.version_info >= (3, 12):
    from typing import ForwardRef
    import pydantic.typing as pt

    def _evaluate_forwardref(type_: ForwardRef, globalns, localns):
        return type_._evaluate(globalns, localns, recursive_guard=set())

    pt.evaluate_forwardref = _evaluate_forwardref
