# Write your code here :-)
class Votepad:

    def __init__(self, ID, sensor, color, date, nrVotes):
        self.ID = ID
        self.sensor = sensor
        self.color = color
        self.date = date
        self.nrVotes = nrVotes

    def toJSON(self):
        jsonData = '{"type":"touchpad",' + '"id":"' + str(self.ID)
        jsonData = jsonData + '",' + '"startBall":"' + str(self.startBall)
        jsonData = jsonData + '",' + '"endBall":"' + str(self.endBall)
        jsonData = jsonData + '",' + '"date":"' + str(self.date) + '"' + '}'
        return jsonData

    def addVote(self):
        self.nrVotes = self.nrVotes + 1
