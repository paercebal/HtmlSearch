import os
import os.path
import time
import xml.etree.ElementTree as ET
import io

class SearchItem:

	def __init__(self, shortName, description, image, url):
		self.shortName = shortName
		self.description = description
		self.image = image
		self.url = url
#

def getAllFilenamesInPath(path, file_suffix):
	files = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]
	files = [f for f in files if (f.endswith(file_suffix))]
	return files
#

def getElementText(root, name, ns):
	element = root.find(name, ns)
	if element is None:
		return ''
	return element.text
#

def getElementAttribute(root, name, ns, attribute):
	element = root.find(name, ns)
	if element is None:
		return ''
	return element.get(attribute)
#

def getDataFromOneFile(path, file):
	fullpath = os.path.join(path, file)
	#print('{}'.format(fullpath))
	
	ns = { 'os' : 'http://a9.com/-/spec/opensearch/1.1/' }
	root = ET.parse(fullpath).getroot()
	shortName = getElementText(root, 'os:ShortName', ns)
	description = getElementText(root, 'os:Description', ns)
	image = getElementText(root, 'os:Image', ns)
	url = getElementAttribute(root, 'os:Url', ns, 'template')
	url = url.replace('http://', 'https://')

	# print('   shortName : [{}]'.format(shortName))
	# print('   description : [{}]'.format(description))
	# print('   image : [{}]'.format(image))
	# print('   url : [{}]'.format(url))
	# print('\n')
	
	item = SearchItem(shortName, description, image, url)
	
	return item
#







if __name__ == '__main__':

	print("\nGenerating List of Search Engines!")
	print("====================================\n")

	path = "searchplugins"
	files = getAllFilenamesInPath(os.path.join(path), ".xml");
	items = dict()

	for f in files:
		item = getDataFromOneFile(path, f)
		items[f] = item
		#print('{}'.format(f))

	print('   Length: {}'.format(len(items)))
	
	text = ''
	text += '// Add the count of visible comboboxes\n'
	text += 'paercebal.HtmlSearch.count({});\n'.format(10)
	text += '\n'
	text += '// Add below, in order, the item identifiers you want to appear by default\n'
	text += 'paercebal.HtmlSearch.orderedItem("{}");\n'.format('google-pure.xml')
	text += 'paercebal.HtmlSearch.orderedItem("{}");\n'.format('mass-effect-wiki-en.xml')
	text += 'paercebal.HtmlSearch.orderedItem("{}");\n'.format('pathfinder-wiki-fr.xml')
	text += '\n'
	text += '// Add below, in no particular order, all the items data you want to be available\n'
		
	for (k, v) in items.items():
		text += 'paercebal.HtmlSearch.item("{}", "{}", "{}", "{}", "{}");\n'.format(k, v.shortName, v.url, v.description, v.image)
		# print('{}'.format(k))
		# print('   shortName : [{}]'.format(v.shortName))
		# print('   description : [{}]'.format(v.description))
		# print('   image : [{}]'.format(v.image))
		# print('   url : [{}]'.format(v.url))
		# print('\n')
		
	#print('   \n{}\n.'.format(text))
	
	with open('paercebal.HtmlSearch.list.js', 'w', encoding='utf8') as file:
		file.write(text)	
	
	print('   \n   End.')
#
