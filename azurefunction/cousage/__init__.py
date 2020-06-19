import logging
import json
import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    data = [
        {
            "name": "SUVs",
            "CO2": "7920"
        },
        {
            "name": "Truck",
            "C02": "54000"
        },
        {
            "name": "Bus",
            "CO2": "49320"
        },
        {
            "name": "Refrigerator",
            "CO2": "211"
        },
        {
            "name": "Freezer",
            "CO2": "234"
        },
        {
            "name": "Dishwasher",
            "CO2": "1202.5"
        },
        {
            "name": "Microwave",
            "CO2": "910"
        },
        {
            "name": "Light Bulb",
            "CO2": "39"
        },
        {
            "name": "Energy-saving Lightbulb",
            "CO2": "7"
        },
        {
            "name": "Television",
            "CO2": "123.5"
        },
        {
            "name": "Washing Machine",
            "CO2": "1137.5"
        },
        {
            "name": "Clothes Dryer",
            "CO2": "2015"
        },
        {
            "name": "Hair Dryer",
            "CO2": "910"
        },
        {
            "name": "Computer",
            "CO2": "143"
        },
        {
            "name": "Window Air Conditioner",
            "CO2": "1885"
        }
    ]
    try:
        return func.HttpResponse(json.dumps(data), mimetype='application/json')
    except Exception as ex:
        return func.HttpResponse(
            str(ex),
            status_code=400
        )
