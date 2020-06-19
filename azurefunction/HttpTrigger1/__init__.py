import logging
import json
import pathlib
import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        data = ''
        with open(pathlib.Path(__file__).parent / 'data.geojson') as f:
            data = json.load(f)
        return func.HttpResponse(json.dumps(data), mimetype='application/json')
    except Exception as ex:
        return func.HttpResponse(
            "Error: "+str(ex),
            status_code=400
        )
